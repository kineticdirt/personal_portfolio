# Asset Management Solutions for Your Portfolio

## Quick Summary
✅ **Swap increased to 500MB**
✅ **6 new loading GIFs added with random selection**
✅ **Neon white-blue bloom/3D hover effects added**

## Asset Management Solutions

### Option 1: SFTP/SCP via VS Code/Cursor Extensions (RECOMMENDED)

**Install one of these extensions:**
1. **SFTP** by Natizyskunk (most popular)
2. **Remote - SSH** (already using this!)

**With Remote-SSH (you already have this):**
- You're already connected! Just use the Cursor file explorer
- Drag and drop files directly into `~/personal_portfolio/assets/images/`
- Works like local development

**Steps:**
1. Open Cursor file explorer (left sidebar)
2. Navigate to `/home/abhinav/personal_portfolio/assets/images/`
3. Right-click → Upload files or drag & drop
4. Files instantly appear on your server

---

### Option 2: Windows File Explorer via SSHFS

**Install WinFsp + SSHFS-Win:**
```bash
# On Windows:
# 1. Download and install WinFsp: https://winfsp.dev/rel/
# 2. Download and install SSHFS-Win: https://github.com/winfsp/sshfs-win
# 3. Map network drive:
#    \\sshfs\abhinav@linuxbox\home\abhinav\personal_portfolio\assets\images
```

Now you can drag files from Windows Explorer directly!

---

### Option 3: Create Upload API Endpoint

I can create a simple upload endpoint in your portfolio API:

**Features:**
- Upload files via browser at `https://abhinavall.net/upload`
- Password protected
- Drag & drop interface
- Automatically organizes files

Want me to implement this?

---

### Option 4: Cloud Storage Sync

**Use Cloudflare R2 or AWS S3:**
- Store assets in cloud
- Use CDN URLs in your website
- Faster load times
- Never worry about server storage

**Setup:**
```bash
# Install AWS CLI or rclone
# Sync local folder to cloud
rclone sync ~/personal_portfolio/assets/images/ r2:portfolio-assets/
```

---

### Option 5: Git-based Asset Management

**Current setup (simplest for you):**

```bash
# On Windows (in git bash or PowerShell):
cd path/to/local/portfolio
git add assets/images/new-image.gif
git commit -m "Add new asset"
git push

# On linuxbox (automatic via GitHub Actions or manual):
cd ~/personal_portfolio
git pull
sudo systemctl restart abhinav-portfolio
```

---

## My Recommendation for You

**Use Remote-SSH (you already have it!):**

1. In Cursor, you're already connected to linuxbox
2. File explorer shows your remote files
3. Just drag & drop files into the assets folder
4. They're instantly on the server
5. Refresh your website to see changes

**Alternative if you want Windows Explorer access:**
- Install SSHFS-Win + WinFsp
- Map the remote folder as a network drive
- Use it like a local folder

---

## Quick Commands for Common Tasks

### Download image from URL to server:
```bash
cd ~/personal_portfolio/assets/images/
wget -O filename.gif "https://url-to-image.com/image.gif"
```

### Upload from Windows to server:
```bash
# Using SCP (in PowerShell/CMD)
scp C:\path\to\image.gif abhinav@linuxbox:~/personal_portfolio/assets/images/
```

### Create organized folders:
```bash
cd ~/personal_portfolio/assets/
mkdir -p gifs backgrounds icons
```

---

## Current Website Updates

### ✨ New Features:
1. **Random Loading GIFs**: Each page load shows a different GIF from 7 options
2. **Neon Bloom Effects**: 
   - Hover over headings for white-blue glow
   - Nav links have subtle bloom
   - Buttons scale up with glow
   - Skill tags and stat numbers have 3D pop
   - Project titles glow on card hover

3. **Effect Details**:
   - Uses neon white-blue color scheme (not pure white/blue)
   - Blends from original colors with tint
   - Applied sparingly to key interactive elements
   - 3D transform with perspective and scale

---

## Test Your Changes

Visit: **https://abhinavall.net**

Try hovering over:
- Your name in the hero section
- Section titles
- Navigation links
- Project titles
- Skill tags
- Stat numbers (3+, 25+, etc.)
- Buttons

Refresh multiple times to see different loading GIFs!

