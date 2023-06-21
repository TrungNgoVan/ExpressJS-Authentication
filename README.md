# Authentication API

This project is a Node.js backend with Javascript that uses MongoDB for data storage and JWT authentication for user authentication and authorization. The project also uses bcryptjs for password encoding and decoding.

## Project Setup

1. Clone the repository
2. Install dependencies using 
    ``` shell
    yarn install
    ```
3. Create a .env file and add the following:
    ```javascript
    JWT_SECRET=<your-jwt-secret>
    ```
4. Run the project using 
    ```shell
    yarn dev
    ```
## Dependencies

- body-parser
- dotenv
- express
- jsonwebtoken
- mongoose
- morgan
- passport
- passport-jwt
- bcryptjs
## Middleware

- body-parser: parses incoming request bodies in a middleware before your handlers, available under the req.body property.
- express: web application framework.
- logger: logs HTTP requests and errors.
- mongoose: MongoDB object modeling tool.
- dotenv: loads environment variables from a .env file into process.env.
## Authentication

This project uses JWT authentication and bcryptjs for password encoding and decoding. The following packages are used:
- jsonwebtoken: generates and verifies JSON web tokens.
- passport: authentication middleware for Node.js.
- passport-jwt: passport strategy for authenticating with a JSON Web Token (JWT).
- bcryptjs: library for hashing passwords.
