local function addHtmlDependency()
  if quarto.doc.is_format("html:js") then
    quarto.doc.add_html_dependency({
      name = 'bluesky-comments-section',
      version = '1.0.0',
      scripts = { "bluesky-comments.js" }
    })
  end
end

local function bluesky_comments(args, kwargs, meta)
  -- Check if exactly one argument is provided
  if #args ~= 1 then
    error("bluesky-comments-section shortcode requires exactly one argument: the Bluesky post URL")
  end

  addHtmlDependency()

  local bsky_post = pandoc.utils.stringify(args[1])

  -- Start building HTML with required post attribute
  local html = "<bluesky-comments-section post=\"" .. bsky_post .."\""

  -- Add any additional attributes from kwargs
  for key, value in pairs(kwargs) do
    -- Validate that key is a string
    if type(key) ~= "string" then
      error("Invalid kwarg key: " .. tostring(key) .. ". Keys must be strings.")
    end

    -- Handle different value types
    if type(value) == "string" then
      if value == "true" then
        html = html .. " " .. key
      elseif value ~= "false" then
        html = html .. " " .. key .. "=\"" .. value .. "\""
      end
    else
      error("Invalid kwarg value for '" .. key .. "'. Values must be strings.")
    end
  end

  html = html .. "></bluesky-comments-section>"
  return pandoc.RawBlock("html", html)
end

return {
  ['bluesky-comments'] = bluesky_comments
}
