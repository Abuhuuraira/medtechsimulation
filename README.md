# medtechsimulation

## Contact form backend

The contact form on `pages/contact_us.html` now submits to `api/contact.php`.

- The frontend auto-detects the API URL, so the same code works on localhost and Hostinger.
- Supported deployment styles: domain root (for example `/api/contact.php`) and subfolder installs (for example `/your-folder/api/contact.php`).

- Every valid submission is saved to `data/contact_submissions.jsonl`.
- An admin email notification is sent for each submission.

### Server requirements

- PHP must be enabled on the hosting server.
- PHP `mail()` must be configured (SMTP/sendmail on the server).
- Optional: set `ADMIN_EMAIL` environment variable on the server to override the default recipient (`info@medtechsimulation.com`).
- The website must be served through IIS/Apache/Nginx with PHP enabled (opening HTML files directly from disk will not execute `api/contact.php`).

### Functional requirements checklist

- Contact page can POST to `api/contact.php` from both `/pages/contact_us` and `/pages/contact_us.html` routes.
- Backend validates required fields (`name`, `email`, `message`) and email format.
- Honeypot field (`website`) blocks basic bot submissions.
- Valid submissions are appended to `data/contact_submissions.jsonl`.
- Backend returns JSON for all responses.
- Optional email notification is attempted using PHP `mail()`.

### Troubleshooting

- If form status shows "Contact service is not configured correctly on this server", PHP is not executing or endpoint response is not JSON.
- If submissions fail with storage errors, grant write permission to the project folder so PHP can create and write to `data/`.
- If file logging works but no emails arrive, SMTP/mail settings are not configured correctly for PHP.

### Windows/IIS setup steps

1. Enable PHP in IIS (FastCGI)
	- Install PHP for Windows.
	- In IIS Manager, open **Handler Mappings** and ensure `*.php` is mapped to `php-cgi.exe`.
	- In IIS Manager, open **FastCGI Settings** and confirm PHP is registered.

2. Configure PHP mail in `php.ini`
	- Edit your active `php.ini` and set SMTP values, for example:

```ini
[mail function]
SMTP = smtp.your-provider.com
smtp_port = 587
sendmail_from = no-reply@yourdomain.com
```

3. Set admin recipient email for this app
	- Add `ADMIN_EMAIL` as a Windows environment variable (System Properties -> Environment Variables),
	  or set it for the IIS Application Pool identity environment.
	- Example value:

```text
ADMIN_EMAIL=admin@yourdomain.com
```

4. Restart IIS after changes

```powershell
iisreset
```

5. Test
	- Submit the contact form from `pages/contact_us.html`.
	- Confirm new entries are saved in `data/contact_submissions.jsonl`.
	- Confirm admin inbox receives the notification email.

### Localhost quick start (Windows)

- Double-click `start-php-local.bat` in the project root.
- It starts PHP at `http://127.0.0.1:8000` and opens `pages/contact_us.html` automatically.
- Keep that terminal window open while testing the contact form.
- Press `Ctrl + C` in that window to stop the local server.