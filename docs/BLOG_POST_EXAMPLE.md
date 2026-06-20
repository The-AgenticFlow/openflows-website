# Example Blog Post with Media Support

Here's a complete example you can paste into the BlogEditor's content field:

```markdown
# Introducing OpenFlows: A New Era of Agent Orchestration

We're excited to announce the latest updates to the OpenFlows platform, including native video support, enhanced image handling, and a completely redesigned admin experience.

## What's New

### 🎬 Video Embeds

You can now embed videos directly into your blog posts. Here's how:

**YouTube:**
![video](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

**Vimeo:**
![video](https://vimeo.com/148751763)

**Native Video (MP4):**
![video](https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4)

### 🖼️ Image Support

Images are rendered automatically from markdown:

![OpenFlows Architecture Diagram](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200)

*Figure 1: Modern cloud architecture patterns*

### 📊 Code Examples

Here's a quick example of how to embed a video in your content:

```javascript
// The MarkdownRenderer automatically detects video URLs
const content = `
![video](https://youtube.com/watch?v=...)
`;
```

### ✅ Feature Checklist

- [x] YouTube video embeds
- [x] Vimeo video embeds
- [x] Native video playback (MP4, WebM)
- [x] Image upload and display
- [x] Drag-and-drop media insertion
- [x] Responsive design

## Getting Started

1. Navigate to the **Admin Panel**
2. Click **"New Post"**
3. Use the media toolbar to insert images or videos
4. Publish your post!

> "The best way to predict the future is to create it." — Peter Drucker

## Conclusion

We hope these new features make it easier than ever to create rich, engaging content on the OpenFlows platform. Happy writing!

---

*For more information, check out our [documentation](/docs) or [contact us](/about).*
```

## How to Use This Example

1. Go to `/admin` and log in
2. Click **"New Post"**
3. Fill in the title, excerpt, and category
4. Paste the markdown above into the **Content** field
5. Use the **media toolbar** buttons to upload your own images/videos
6. Click **"Preview Markdown"** to see how it renders
7. Set status to **"Published"** and save

## Media Syntax Reference

| Type | Syntax | Example |
|------|--------|---------|
| Image | `![alt text](image-url)` | `![Logo](/logo.png)` |
| Video (YouTube) | `![video](youtube-url)` | `![video](https://youtube.com/watch?v=abc123)` |
| Video (Vimeo) | `![video](vimeo-url)` | `![video](https://vimeo.com/123456)` |
| Video (Native) | `![video](video-file-url)` | `![video](https://example.com/video.mp4)` |

The `![video](url)` syntax is automatically detected and rendered as an embedded video player. Regular `![alt](url)` syntax renders as images.
