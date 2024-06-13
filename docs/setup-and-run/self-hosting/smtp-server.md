# SMTP Server

To enable a secure Password Reset Flow and a future eMail check on Sign-up, you need your own SMTP Server ready. To configure the SMTP Server, you can use the following ENV Variables at the **API-Server Image**.

<table><thead><tr><th width="426">Environment Variable</th><th width="223">Description</th><th>Default Value</th></tr></thead><tbody><tr><td><code>LOWCODER_ADMIN_SMTP_HOST</code></td><td>SMTP Hostname of your Mail Relay Server</td><td></td></tr><tr><td><code>LOWCODER_ADMIN_SMTP_PORT</code></td><td>Port number for the SMTP service</td><td><code>587</code></td></tr><tr><td><code>LOWCODER_ADMIN_SMTP_USERNAME</code></td><td>Username for SMTP authentication</td><td></td></tr><tr><td><code>LOWCODER_ADMIN_SMTP_PASSWORD</code></td><td>Password for SMTP authentication</td><td></td></tr><tr><td><code>LOWCODER_ADMIN_SMTP_AUTH</code></td><td>Enable SMTP authentication</td><td><code>true</code></td></tr><tr><td><code>LOWCODER_ADMIN_SMTP_SSL_ENABLED</code></td><td>Enable SSL encryption</td><td><code>false</code></td></tr><tr><td><code>LOWCODER_ADMIN_SMTP_STARTTLS_ENABLED</code></td><td>Enable STARTTLS encryption</td><td><code>true</code></td></tr><tr><td><code>LOWCODER_ADMIN_SMTP_STARTTLS_REQUIRED</code></td><td>Require STARTTLS encryption</td><td><code>true</code></td></tr></tbody></table>