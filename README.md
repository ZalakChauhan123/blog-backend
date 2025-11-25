## Base URL :-

<ul>
  <li>All API endpoints are relative to the following base URL  "/api/v1". <br></li>
  <li>For example, the user registration endpoint is  "/api/v1/auth/register"</li>
</ul>


<h2>Overview</h2>

<p><strong>API Version:</strong> 1.0.0</p>

<p><strong>Authentication:</strong> Uses JWT Bearer tokens for access and JWT refresh tokens (via HTTP-only cookies).</p>

<p><strong>Authorization:</strong> Role‑based access control ('admin', 'user'). Specific roles are required for certain endpoints.</p>

<p><strong>Rate Limiting:</strong> Applied globally (60 requests per minute per IP).</p>

<p><strong>Input Validation:</strong> Uses express-validator. Invalid requests return 400 Bad Request errors.</p>

<p><strong>Content Format:</strong> Primarily JSON (<code>application/json</code>). File uploads use <code>multipart/form-data</code>.</p>


<h2>Authentication</h2>
<p>This API uses JSON Web Tokens (JWT) for securing endpoints. It employs a two-token strategy: an Access Token and a Refresh Token.</p>

<h3>Access Token</h3>
<ul>
  <li><strong>Usage:</strong> Required for accessing protected API endpoints.</li>
  <li><strong>Lifetime:</strong> Predefined expiration time (configured on the server, e.g., 15 minutes). Once expired, you'll receive a 401 Unauthorized error.</li>
  <li><strong>Obtaining:</strong> Received upon successful registration (<code>/auth/register</code>) or login (<code>/auth/login</code>). Can be renewed using a valid Refresh Token (<code>/auth/refresh-token</code>).</li>
</ul>

<h3>Refresh Token</h3>
<ul>
  <li><strong>Usage:</strong> Used to obtain a new Access Token when the current one expires, without requiring the user to log in again.</li>
  <li><strong>Lifetime:</strong> Refresh tokens have a longer expiration time (configured on the server, e.g., 7 days).</li>
  <li><strong>Obtaining:</strong> Set automatically as a cookie upon successful registration or login.</li>
  <li><strong>Invalidation:</strong> Deleted from the server and the cookie is cleared upon logout (<code>/auth/logout</code>).</li>
</ul>

<h3>Authentication Flow</h3>
<ol>
  <li><strong>Register or Login:</strong> Call <code>/auth/register</code> or <code>/auth/login</code> with valid credentials.</li>
  <li><strong>Receive Tokens:</strong>
    <ul>
      <li>You receive an <strong>accessToken</strong> in the response body.</li>
      <li>The <strong>refreshToken</strong> is set as an HttpOnly cookie.</li>
    </ul>
  </li>
  <li><strong>Access Protected Resources:</strong> Make requests to other API endpoints with accessToken in the <code>Authorization: Bearer &lt;token&gt;</code> header.</li>
  <li><strong>Handle Expired Access Token:</strong>
    <ul>
      <li>If a request returns a 401 Unauthorized error with an expired access token:</li>
      <li>Call <code>POST /auth/refresh-token</code>. This endpoint uses the refreshToken cookie automatically sent by the browser.</li>
      <li>Receive a new <strong>accessToken</strong> in the response.</li>
      <li>Retry the original request with the new accessToken.</li>
    </ul>
  </li>
  <li><strong>Handle Expired Refresh Token:</strong>
    <ul>
      <li>If the <code>/auth/refresh-token</code> endpoint returns a 401 Unauthorized error, the refresh token has expired or is invalid.</li>
      <li>The user must log in again via <code>/auth/login</code>.</li>
    </ul>
  </li>
  <li><strong>Logout:</strong> Call <code>POST /auth/logout</code>. This requires both the accessToken (in the header) and the refreshToken (in the cookie) to be valid. It invalidates the refresh token on the server and clears the cookie.</li>
</ol>

<h2>Error Handling</h2>

<p>The API uses standard HTTP status codes to indicate the success or failure of a request. Errors generally return a JSON body with <code>code</code> and <code>message</code> fields. Validation errors include an additional <code>errors</code> object.</p>

<h3>Common Status Codes &amp; Error Codes</h3>
<table border="1" cellpadding="5" cellspacing="0">
  <thead>
    <tr>
      <th>Status Code</th>
      <th>code Value(s)</th>
      <th>Meaning</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>200 OK</td>
      <td>N/A</td>
      <td>Request successful.</td>
    </tr>
    <tr>
      <td>201 Created</td>
      <td>N/A</td>
      <td>Resource created successfully.</td>
    </tr>
    <tr>
      <td>204 No Content</td>
      <td>N/A</td>
      <td>Request successful, no response body needed (e.g., successful deletion).</td>
    </tr>
    <tr>
      <td>400 Bad Request</td>
      <td>ValidationError</td>
      <td>Input validation failed (e.g., missing required field, invalid format). See <code>errors</code> object for details.</td>
    </tr>
    <tr>
      <td>400 Bad Request</td>
      <td>BadRequest</td>
      <td>General bad request (e.g., trying to like an already liked blog).</td>
    </tr>
    <tr>
      <td>401 Unauthorized</td>
      <td>AuthenticationError</td>
      <td>Missing, invalid, or expired accessToken or refreshToken. Check message for specifics.</td>
    </tr>
    <tr>
      <td>403 Forbidden</td>
      <td>AuthorizationError</td>
      <td>User lacks permission (role) for the action, or attempting unauthorized admin registration.</td>
    </tr>
    <tr>
      <td>404 Not Found</td>
      <td>NotFound</td>
      <td>The requested resource (user, blog, comment) could not be found.</td>
    </tr>
    <tr>
      <td>413 Payload Too Large</td>
      <td>ValidationError</td>
      <td>Uploaded file exceeds the size limit (2MB for blog banners).</td>
    </tr>
    <tr>
      <td>429 Too Many Requests</td>
      <td>N/A</td>
      <td>Rate limit exceeded (see Rate Limiting guide).</td>
    </tr>
    <tr>
      <td>500 Internal Server Error</td>
      <td>ServerError</td>
      <td>An unexpected error occurred on the server. Contact support if this persists.</td>
    </tr>
  </tbody>
</table>

<h3>Error Response Format</h3>

<p><strong>General Error:</strong></p>
<pre><code>{
  "code": "NotFound",
  "message": "Blog not found"
}
</code></pre>

<p><strong>Validation Error:</strong></p>
<pre><code>{
  "code": "ValidationError",
  "errors": {
    "email": {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid email address",
      "path": "email",
      "location": "body"
    },
    "password": {
      "type": "field",
      "value": "short",
      "msg": "Password must be at least 8 characters long",
      "path": "password",
      "location": "body"
    }
  }
}
</code></pre>

