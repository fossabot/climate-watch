class ImportStories
  require 'rss'
  require 'open-uri'

  def call(reset = false)
    cleanup if reset

    import_stories
  end

  private

  def cleanup
    Story.delete_all
  end

  def tags()

  end

  def import_stories
    existing = Story.count
    url = 'http://www.wri.org/blog/rss2.xml'
    rss = open(url)
    feed = RSS::Parser.parse(rss, false)
    link_sanitizer = Rails::Html::LinkSanitizer.new
    puts "Channel Title: #{feed.channel.title}"
    feed.items.each do |item|
      title = link_sanitizer.sanitize(item.title)
      published_at = item.pubDate
      story = Story.find_or_initialize_by(title: title,
                                          published_at: published_at)
      story.description = item.description
      story.link = item.link.split(/href="|">/)[1]
      story.background_image_url = item.enclosure ? item.enclosure.url : ''
      story.tags = item.category ? item.category.content : ''
      story.save
    end
    puts "#{Story.count - existing} new stories"
  end
end
