# HTTPS Deployment Guide for Docker Projects

Complete guide to deploy Docker containers with SSL/HTTPS using Nginx and Let's Encrypt.

## Prerequisites

- Ubuntu/Debian server with root access
- Domain name pointing to your server IP
- Docker installed
- Nginx installed
- Certbot installed

## Quick Setup Commands

### 1. Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# Install Docker (if not installed)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

---

## Step-by-Step Deployment Process

### Step 1: Pull and Run Your Docker Container

```bash
# Pull your Docker image
docker pull asif449/cpl-website:12

# Stop and remove old container (if exists)
docker stop cloudproduction-app 2>/dev/null || true
docker rm cloudproduction-app 2>/dev/null || true

# Run the container on port 3000 (internal)
docker run -d \
  --name cloudproduction-app \
  --restart unless-stopped \
  -p 3000:3000 \
  asif449/cpl-website:12

# Verify container is running
docker ps
curl -I http://localhost:3000
```

### Step 2: Create Nginx Configuration

```bash
# Create Nginx site configuration
cat > /etc/nginx/sites-available/yoursite.com.conf << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# Replace 'yoursite.com' and 'yourdomain.com' with your actual domain
```

### Step 3: Enable the Site

```bash
# Create symbolic link to enable site
ln -s /etc/nginx/sites-available/yoursite.com.conf /etc/nginx/sites-enabled/

# Remove default site if it conflicts
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-enabled/default.conf

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

### Step 4: Test HTTP Access

```bash
# Test locally
curl -I http://localhost

# Test with domain
curl -I http://yourdomain.com
```

### Step 5: Install SSL Certificate

```bash
# Get SSL certificate from Let's Encrypt
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts:
# 1. Enter your email address
# 2. Agree to Terms of Service (Y)
# 3. Share email with EFF (Y/N - your choice)
```

**Certbot will automatically:**
- Get the SSL certificate
- Configure Nginx to use HTTPS
- Set up HTTP to HTTPS redirect
- Configure auto-renewal

### Step 6: Verify HTTPS

```bash
# Test HTTPS
curl -I https://yourdomain.com

# Test HTTP redirect
curl -I http://yourdomain.com

# Check certificate expiry
certbot certificates
```

---

## Complete One-Command Deployment Script

Save this as `deploy-docker-https.sh`:

```bash
#!/bin/bash

# Configuration
DOMAIN="yourdomain.com"
WWW_DOMAIN="www.yourdomain.com"
DOCKER_IMAGE="asif449/cpl-website:12"
CONTAINER_NAME="cloudproduction-app"
APP_PORT="3000"
EMAIL="your-email@example.com"

echo "🚀 Starting deployment..."

# 1. Pull and run Docker container
echo "📦 Deploying Docker container..."
docker pull $DOCKER_IMAGE
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true
docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p $APP_PORT:$APP_PORT \
  $DOCKER_IMAGE

# 2. Create Nginx configuration
echo "⚙️  Configuring Nginx..."
cat > /etc/nginx/sites-available/${DOMAIN}.conf << EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name $DOMAIN $WWW_DOMAIN;
    
    location / {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 3. Enable site
ln -sf /etc/nginx/sites-available/${DOMAIN}.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-enabled/default.conf

# 4. Test and reload Nginx
nginx -t && systemctl reload nginx

# 5. Get SSL certificate
echo "🔒 Installing SSL certificate..."
certbot --nginx --non-interactive --agree-tos --email $EMAIL \
  -d $DOMAIN -d $WWW_DOMAIN

echo "✅ Deployment complete!"
echo "🌐 Your site is now live at: https://$DOMAIN"
```

**To use the script:**
```bash
# Edit the configuration variables
nano deploy-docker-https.sh

# Make it executable
chmod +x deploy-docker-https.sh

# Run it
sudo ./deploy-docker-https.sh
```

---

## Important Configuration Details

### Nginx Configuration File Location
- **Available sites**: `/etc/nginx/sites-available/`
- **Enabled sites**: `/etc/nginx/sites-enabled/`
- **Must end with**: `.conf` extension (CloudPanel requirement)

### Port Configuration
- **Docker Container**: Runs on port 3000 (internal)
- **Nginx**: Listens on ports 80 (HTTP) and 443 (HTTPS)
- **Proxy**: Nginx forwards requests from 80/443 to 3000

### SSL Certificate Paths
After installation, certificates are stored at:
- **Certificate**: `/etc/letsencrypt/live/yourdomain.com/fullchain.pem`
- **Private Key**: `/etc/letsencrypt/live/yourdomain.com/privkey.pem`

---

## Updating Your Application

When you need to deploy a new version:

```bash
# 1. Build and push new image (from local machine)
docker buildx build --platform linux/amd64 -t asif449/cpl-website:13 --push .

# 2. On server: Pull new image
docker pull asif449/cpl-website:13

# 3. Stop old container
docker stop cloudproduction-app
docker rm cloudproduction-app

# 4. Run new container
docker run -d \
  --name cloudproduction-app \
  --restart unless-stopped \
  -p 3000:3000 \
  asif449/cpl-website:13

# 5. Verify
docker ps
curl -I https://yourdomain.com
```

**Note**: No need to reconfigure Nginx or SSL - they remain the same!

---

## Troubleshooting

### Issue: "Connection Refused" on port 80
```bash
# Check if Nginx is listening on port 80
netstat -tlnp | grep :80

# Check Nginx status
systemctl status nginx

# Check Nginx error logs
tail -f /var/log/nginx/error.log
```

### Issue: "Empty reply from server"
```bash
# Check if there's a default server blocking requests
ls -la /etc/nginx/sites-enabled/

# Remove conflicting default configs
rm /etc/nginx/sites-enabled/default*

# Restart Nginx
systemctl restart nginx
```

### Issue: Docker container not accessible
```bash
# Check if container is running
docker ps

# Check container logs
docker logs cloudproduction-app

# Test direct container access
curl -I http://localhost:3000
```

### Issue: SSL Certificate not working
```bash
# Check certificate status
certbot certificates

# Renew certificate manually
certbot renew --dry-run

# Check Nginx SSL configuration
nginx -t
```

### Issue: HTTP not redirecting to HTTPS
Certbot should set this up automatically. If not:
```bash
# Manually add redirect in Nginx config
cat > /etc/nginx/sites-available/yoursite.com.conf << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

nginx -t && systemctl reload nginx
```

---

## Maintenance Commands

### View Docker Logs
```bash
docker logs -f cloudproduction-app
```

### Restart Container
```bash
docker restart cloudproduction-app
```

### Check SSL Certificate Expiry
```bash
certbot certificates
```

### Manually Renew SSL Certificate
```bash
certbot renew
```

### Test Auto-Renewal
```bash
certbot renew --dry-run
```

### Restart Nginx
```bash
systemctl restart nginx
```

### Check Nginx Configuration
```bash
nginx -t
```

---

## SSL Auto-Renewal

Certbot automatically sets up a cron job or systemd timer for certificate renewal.

### Check Auto-Renewal Setup
```bash
# Check systemd timer
systemctl list-timers | grep certbot

# Or check cron
cat /etc/cron.d/certbot
```

### Test Auto-Renewal
```bash
certbot renew --dry-run
```

Certificates will automatically renew 30 days before expiration.

---

## Security Best Practices

### 1. Enable Firewall
```bash
# Allow SSH, HTTP, and HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 2. Add Security Headers (Already included in config)
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block

### 3. Enable HSTS (Optional)
Add to Nginx HTTPS server block:
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### 4. Regular Updates
```bash
# Update system regularly
apt update && apt upgrade -y

# Update Docker images
docker pull asif449/cpl-website:latest
```

---

## Quick Reference

### Essential Commands
```bash
# Deploy new version
docker pull asif449/cpl-website:TAG && \
docker stop cloudproduction-app && \
docker rm cloudproduction-app && \
docker run -d --name cloudproduction-app --restart unless-stopped -p 3000:3000 asif449/cpl-website:TAG

# Check status
docker ps
systemctl status nginx
curl -I https://yourdomain.com

# View logs
docker logs -f cloudproduction-app
tail -f /var/log/nginx/access.log

# Restart services
docker restart cloudproduction-app
systemctl restart nginx
```

### File Locations
- Nginx config: `/etc/nginx/sites-available/yoursite.com.conf`
- SSL certificates: `/etc/letsencrypt/live/yourdomain.com/`
- Nginx logs: `/var/log/nginx/`
- Docker logs: `docker logs cloudproduction-app`

---

## Summary Checklist

- [ ] Server has Docker, Nginx, and Certbot installed
- [ ] Domain DNS points to server IP
- [ ] Docker container running on port 3000
- [ ] Nginx configuration created with `.conf` extension
- [ ] Site enabled in `/etc/nginx/sites-enabled/`
- [ ] Nginx configuration tested and reloaded
- [ ] HTTP accessible (test with curl)
- [ ] SSL certificate installed via Certbot
- [ ] HTTPS accessible with valid certificate
- [ ] HTTP redirects to HTTPS
- [ ] Auto-renewal enabled and tested

**Your site should now be live at**: `https://yourdomain.com` 🎉
