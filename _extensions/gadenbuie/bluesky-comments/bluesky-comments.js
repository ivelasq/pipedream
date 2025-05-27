/* global customElements,HTMLElement */
class BlueskyCommentsSection extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.postUri = null
    this.nShowInit = 3
    this.nVisible = this.nShowInit
    this.nShowMore = 5
    this.maxDepth = 3
    this.thread = null
    this.hiddenReplies = null
    this.error = null
    this.visibleRepliesMap = new Map()
    this.expandedThreads = new Map()
  }

  static get observedAttributes () {
    return ['post']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return

    if (name === 'post') {
      this.postUri = newValue
      if (newValue) {
        this.loadThread(this.#convertUri(this.postUri))
      } else {
        this.renderError('Post link (or at:// URI) is required')
      }
    }
  }

  connectedCallback () {
    const nVisible = this.getAttribute('n-init-comments')
    if (nVisible) {
      this.nVisible = parseInt(nVisible)
      this.nShowInit = this.nVisible
    }

    const nShowMore = this.getAttribute('n-show-more')
    if (nShowMore) this.nShowMore = parseInt(nShowMore)

    const maxDepth = this.getAttribute('max-depth')
    if (maxDepth) this.maxDepth = parseInt(maxDepth)
  }

  #convertUri (uri) {
    if (uri.startsWith('at://')) return uri

    const match = uri.match(/bsky\.app\/profile\/([\w.]+)\/post\/([\w]+)/)
    if (match) {
      const [, did, postId] = match
      return `at://${did}/app.bsky.feed.post/${postId}`
    }

    this.error = 'Invalid Bluesky post URL format'
    return null
  }

  #logAtUri (thread) {
    if (this.postUri === thread.post.uri) {
      return
    }

    console.warn(
      `[bluesky-comments] For more stable and future-proof comments, replace the post URL ${this.postUri} with the resolved AT-proto URI ${thread.post.uri}.`,
      { source: this.postUri, resolved: thread.post.uri }
    )
  }

  async loadThread (uri) {
    try {
      const thread = await this.fetchThread(uri)
      this.#logAtUri(thread)
      this.thread = thread
      this.hiddenReplies =
        thread.post?.threadgate?.record?.hiddenReplies ?? null
      this.render()
    } catch (err) {
      console.error('[bluesky-comments] Error loading thread:', err)
      this.renderError('Error loading comments')
    }
  }

  async fetchThread (uri) {
    if (!uri || typeof uri !== 'string') {
      throw new Error('Invalid URI: A valid string URI is required.')
    }

    const params = new URLSearchParams({ uri })
    const url = `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?${params.toString()}`

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        },
        cache: 'no-store'
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Fetch Error: ', errorText)
        throw new Error(`Failed to fetch thread: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.thread || !data.thread.replies) {
        throw new Error('Invalid thread data: Missing expected properties.')
      }

      return data.thread
    } catch (error) {
      console.error('Error fetching thread:', error.message)
      throw error
    }
  }

  render () {
    if (!this.thread) {
      this.renderError('Thread not found.')
      return
    }

    const sortedReplies = this.#filterSortReplies(this.thread.replies || [])

    const comments = document.createElement('comments')
    comments.innerHTML = `
      <p class="reply-info">
        <a href="https://bsky.app/profile/${
          this.thread.post?.author?.did
        }/post/${this.thread.post?.uri
      .split('/')
      .pop()}" target="_blank" rel="noopener noreferrer">
        Reply on Bluesky</a>
        to join the conversation.
      </p>
      <div id="comments"></div>
      <button id="show-more">
        Show more comments
      </button>
    `
    comments.firstElementChild.insertAdjacentElement(
      'beforebegin',
      this.renderStats(this.thread)
    )

    const commentsContainer = comments.querySelector('#comments')
    sortedReplies.slice(0, this.nVisible).forEach(reply => {
      commentsContainer.appendChild(this.createCommentElement(reply, 0))
    })

    const showMoreButton = comments.querySelector('#show-more')
    if (this.nVisible >= sortedReplies.length) {
      showMoreButton.style.display = 'none'
    }
    showMoreButton.addEventListener('click', () => {
      this.nVisible += this.nShowMore
      this.render()
    })

    this.shadowRoot.innerHTML = ''
    this.shadowRoot.appendChild(comments)
    this.addStyles()
  }

  #filterSortReplies (replies) {
    if (!Array.isArray(replies)) return []

    return replies
      .filter(reply => {
        if (!reply?.post?.record?.text) return false
        if (this.hiddenReplies?.includes(reply.post.uri)) return false
        if (reply.blocked || reply.notFound) return false
        return reply.post.record.text.trim() !== '📌'
      })
      .sort((a, b) => (b.post.likeCount ?? 0) - (a.post.likeCount ?? 0))
  }

  static escapeHTML (htmlString) {
    return htmlString
      .replace(/&/g, '&amp;') // Escape &
      .replace(/</g, '&lt;') // Escape <
      .replace(/>/g, '&gt;') // Escape >
      .replace(/"/g, '&quot;') // Escape "
      .replace(/'/g, '&#039;') // Escape '
  }

  static pluralize (x, one, many) {
    if (Array.isArray(x)) {
      x = x.length
    }
    return x === 1 ? one : many
  }

  createCommentElement (reply, depth = 0) {
    const {
      author,
      record,
      uri,
      likeCount = 0,
      repostCount = 0,
      quoteCount = 0,
      replyCount = 0
    } = reply.post
    const postId = uri.split('/').pop()
    const profileUrl = `https://bsky.app/profile/${author.did}/post/${postId}`

    const comment = document.createElement('div')
    comment.classList.add('comment')
    comment.innerHTML = `
      <div class="author">
        <a href="${profileUrl}" target="_blank" rel="noopener noreferrer">
          ${
            author.avatar
              ? `<img class="avatar" src="${author.avatar}" alt="" />`
              : ''
          }
          ${author.displayName ?? author.handle} @${author.handle}
        </a>
        <p class="comment-text">${BlueskyCommentsSection.escapeHTML(record?.text ?? '')}</p>
        <small class="comment-meta">
          ${likeCount} ${BlueskyCommentsSection.pluralize(likeCount, 'like', 'likes')}
          • ${repostCount + quoteCount} ${BlueskyCommentsSection.pluralize(repostCount + quoteCount, 'repost', 'reposts')}
          • ${replyCount} ${BlueskyCommentsSection.pluralize(replyCount, 'reply', 'replies')}
        </small>
      </div>
    `

    if (reply.replies?.length) {
      const repliesContainer = document.createElement('div')
      repliesContainer.classList.add('replies-container')

      if (!this.visibleRepliesMap.has(uri)) {
        this.visibleRepliesMap.set(uri, this.nShowInit)
      }

      const filteredReplies = this.#filterSortReplies(reply.replies)
      if (filteredReplies.length === 0) {
        return
      }

      const nVisibleReplies = this.visibleRepliesMap.get(uri)
      const wasExpanded = this.expandedThreads.get(uri)
      const isExpanded = depth < this.maxDepth || wasExpanded

      if (isExpanded) {
        filteredReplies
          .slice(0, nVisibleReplies)
          .forEach(childReply =>
            repliesContainer.appendChild(
              this.createCommentElement(childReply, wasExpanded ? 0 : depth + 1)
            )
          )
      }

      // Show more button, only added if needed (signaled by updating its text content)
      const button = document.createElement('button')
      button.classList.add('show-more-replies')

      if (!isExpanded) {
        // Show more button: expand thread
        button.textContent = `Show ${filteredReplies.length} nested ${
          filteredReplies.length === 1 ? 'reply' : 'replies'
        }`
        button.addEventListener('click', () => {
          this.expandedThreads.set(uri, true)
          this.render()
        })
      } else if (filteredReplies.length > nVisibleReplies) {
        // Show more button: More replies
        button.textContent = `Show more replies (${
          filteredReplies.length - nVisibleReplies
        } hidden)`
        button.addEventListener('click', () => {
          this.visibleRepliesMap.set(uri, nVisibleReplies + this.nShowMore)
          this.render()
        })
      }

      if (button.textContent) {
        repliesContainer.appendChild(button)
      }

      comment.appendChild(repliesContainer)
    }

    return comment
  }

  renderStats (reply) {
    const statsBar = document.createElement('p')
    statsBar.classList.add('stats-bar')

    const postUrl = `https://bsky.app/profile/${
      reply.post.author.did
    }/post/${reply.post.uri.split('/').pop()}`

    const statsIcons = {
      likes: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--bs-pink, pink)" class="bi bi-heart-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/></svg>',
      reposts: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--bs-green, green)" class="bi bi-recycle" viewBox="0 0 16 16"><path d="M9.302 1.256a1.5 1.5 0 0 0-2.604 0l-1.704 2.98a.5.5 0 0 0 .869.497l1.703-2.981a.5.5 0 0 1 .868 0l2.54 4.444-1.256-.337a.5.5 0 1 0-.26.966l2.415.647a.5.5 0 0 0 .613-.353l.647-2.415a.5.5 0 1 0-.966-.259l-.333 1.242zM2.973 7.773l-1.255.337a.5.5 0 1 1-.26-.966l2.416-.647a.5.5 0 0 1 .612.353l.647 2.415a.5.5 0 0 1-.966.259l-.333-1.242-2.545 4.454a.5.5 0 0 0 .434.748H5a.5.5 0 0 1 0 1H1.723A1.5 1.5 0 0 1 .421 12.24zm10.89 1.463a.5.5 0 1 0-.868.496l1.716 3.004a.5.5 0 0 1-.434.748h-5.57l.647-.646a.5.5 0 1 0-.708-.707l-1.5 1.5a.5.5 0 0 0 0 .707l1.5 1.5a.5.5 0 1 0 .708-.707l-.647-.647h5.57a1.5 1.5 0 0 0 1.302-2.244z"/></svg>',
      quotes: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--bs-blue, blue)" class="bi bi-chat-dots-fill" viewBox="0 0 16 16"><path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/></svg>'
    }

    statsBar.innerHTML = `
        <span class="stat-item">
          <a href="${postUrl}/liked-by" target="_blank" rel="noreferrer noopener">
            ${statsIcons.likes}
            <span>${reply.post.likeCount ?? 0} likes</span>
          </a>
        </span>
        <span class="stat-item">
          <a href="${postUrl}/reposted-by" target="_blank" rel="noreferrer noopener">
            ${statsIcons.reposts}
            <span>${reply.post.repostCount ?? 0} reposts</span>
          </a>
        </span>
        <span class="stat-item">
          <a href="${postUrl}/quotes" target="_blank" rel="noreferrer noopener">
            ${statsIcons.quotes}
            <span>${reply.post.quoteCount ?? 0} quotes</span>
          </a>
        </span>
    `

    return statsBar
  }

  renderError (message) {
    this.shadowRoot.innerHTML = `<p class="error">Bluesky Comments error: <strong>${message}</strong></p>`
    this.addStyles()
  }

  addStyles () {
    if (this.hasAttribute('no-css')) return
    if (this.shadowRoot.querySelector('style')) return

    const style = document.createElement('style')
    style.textContent = `
      :host {
        --max-width: 100%;
        --border-radius: var(--bs-border-radius, 0.375rem);
        --background-color: var(--bs-body-bg, white);
        --text-color: var(--bs-body-color, black);
        --link-color: var(--bs-link-color, gray);
        --link-hover-color: var(--bs-link-hover-color, black);
        --link-decoration: var(--bs-link-decoration, underline);
        --comment-meta-color: var(--bs-secondary, gray);
        --error-color: var(--bs-danger-text-emphasis, #58151c);
        --error-bg: var(--bs-danger-bg-subtle, #f8d7da);
        --error-border: 1px solid var(--bs-danger-border-subtle, #f1aeb5);
        --reply-border-color: var(--bs-border-color, #ccc);
        --reply-border: 2px solid var(--reply-border-color);
        --avatar-width: 1.375rem;
        --avatar-border-radius: 50%;
        --button-background-color: var(--bs-gray-200, rgba(0,0,0,0.05));
        --button-hover-background-color: var(--bs-gray-300, rgba(0,0,0,0.1));
        --author-avatar-border-radius: 100%;
        --button-padding: 0.5em 1em;
        --button-margin: 0.5em 0;
        --button-font: inherit;
        --button-font-size: 0.9em;
        --button-border-radius: 0.8em;
      }

      comments {
        margin: 0 auto;
        max-width: var(--max-width);
        display: block;
        background-color: var(--background-color);
        color: var(--text-color);
        line-height: 1.2;
      }
      .reply-info {
        font-size: 14px;
        color: var(--text-color);
      }
      .comment {
        margin-bottom: 2em;
      }
      .author {
        a {
          font-size: 0.9em;
          margin-bottom: 0.4em;
          display: inline-block;
          color: var(--link-color);

          &:not(:hover) {
            text-decoration: none;
          }

          &:hover {
            color: var(--link-hover-color);
          }

          img {

          }
        }
      }
      .avatar {
        width: var(--avatar-width);
        margin-right: 0.4em;
        border-radius: var(--avatar-border-radius);
        vertical-align: middle;
      }
      .comment-text {
        margin: 5px 0;
        white-space: pre-line;
      }
      .comment-meta {
        color: var(--comment-meta-color);
        display: block;
        margin: 1em 0 1.5em;
      }
      .replies-container {
        border-left: var(--reply-border);
        padding-left: 1.25em;
      }

      .error {
        color: var(--error-color);
        background-color: var(--error-bg);
        border: var(--error-border);
        border-radius: var(--border-radius);
        padding: 1rem;
      }

      .stats-bar {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0.5rem 0;
      }

      .stat-item a, .stat-item a:hover {
        text-decoration: none;
        color: var(--text-color);
      }

      .stat-item {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        white-space: nowrap;
      }

      .icon {
        width: 1.25rem;
        height: 1.25rem;
      }

      button {
        margin: var(--button-margin);
        padding: var(--button-padding);
        width: 100%;
        font: var(--button-font);
        font-size: var(--button-font-size);
        background: var(--button-background-color);
        border-radius: var(--button-border-radius);
        cursor: pointer;
        border: 0;
        box-sizing: border-box;

        &:hover {
          background: var(--button-hover-background-color);
        }
      }
    `
    this.shadowRoot.appendChild(style)
  }
}

customElements.define('bluesky-comments-section', BlueskyCommentsSection)
