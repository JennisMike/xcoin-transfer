# Installation Guide for Frontend

This document provides step-by-step instructions on how to set up and run the frontend of the project.

## Prerequisites

Ensure you have the following installed on your system before proceeding:

- [Node.js](https://nodejs.org/) (Recommended: latest LTS version)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) (comes with Node.js)
- [Git](https://git-scm.com/) (optional but recommended)

## Installation Steps

### 1. Clone the Repository

```sh
git clone <repository-url>
```

### 2. Navigate to the Frontend Directory

```sh

cd frontend
```

### 3. Install Dependencies

Using npm:

```sh
npm install
```

Or using yarn:

```sh
yarn install
```

### 4. Set Up Environment Variables

Create a `.env` file in the root of the frontend directory and configure it as needed. Example:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### 5. Start the Development Server

Using npm:

```sh
npm run dev
```

Or using yarn:

```sh
yarn run dev
```

The application should now be running at `http://localhost:5173/` by default.

## Building for Production

To create an optimized production build, run:

```sh
npm run build
```

Or using yarn:

```sh
yarn build
```

This will generate a `build` folder with the production-ready files.

## Additional Commands

- **Linting & Formatting:**

  ```sh
  npm run lint
  ```

  or

  ```sh
  yarn lint
  ```
- **Testing:**

  ```sh
  npm test
  ```

  or

  ```sh
  yarn test
  ```

## Troubleshooting

- If you encounter dependency issues, try deleting `node_modules` and `package-lock.json` (or `yarn.lock`) and reinstalling:

  ```sh
  rm -rf node_modules package-lock.json
  npm install --legacy-peer-deps
  ```

  or

  ```sh
  rm -rf node_modules yarn.lock
  yarn install
  ```
- Ensure your API server (backend) is running if the frontend depends on it.

## License

This project is licensed under [Apache License 2.0](LICENSE).

---

Happy coding!
