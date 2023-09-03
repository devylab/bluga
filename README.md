[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/devylab/bluga">
    <!-- <img src="logo.png" alt="Logo" width="80" height="80"> -->
    <h1>Bluga</h1>
  </a>

  <h3 align="center">Bluga</h3>

  <p align="center">
    An open source blogging software
    <br />
    <a href="https://github.com/devylab/bluga"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://bluga.devylab.com/">View Demo</a>
    ·
    <a href="https://github.com/devylab/bluga/issues">Report Bug</a>
    ·
    <a href="https://github.com/devylab/bluga/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-bluga">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#documentation">Documentation</a></li>
    <li><a href="#report-a-bug">Report a bug</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT BLUGA -->

## About Bluga

[//]: # '[![Bluga Screen Shot][product-screenshot]](https://github.com/devylab/bluga)'

Bluga is an open source blogging software built on nodejs, that allows you to build and manage a blog with ease.

Why Bluga?:

- It is easy to setup
- It is lightweight
- It is self-hosted (you can host it on your own cloud provider)
- You can create your own custom theme on it

### Built With

- [![Nodejs][nodejs]][nodejs-url]
- [![Fastify][fastify]][fastify-url]

<!-- GETTING STARTED -->

## Getting Started

To get the project running locally follow these simple steps below.

### Prerequisites

To run Bluga on your local environment you will need to install the following

- Node (node >= 18.9.0)

You can get a detailed instruction on how to install Node from their official [documentation](https://nodejs.org/)

- Postgres

You can get a detailed instruction on how to install Postgres from their official [documentation](https://www.postgresql.org/download/), or you can use the docker image [here](https://hub.docker.com/_/postgres)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/devylab/bluga.git
   ```
2. Install dependencies
   ```sh
   yarn install
   ```
3. Duplicate the `env.sample` in the root directory, rename it to `.env` and update the content
4. Start the project
   ```sh
   yarn dev
   ```

<!-- USAGE EXAMPLES -->

[//]: # '## Usage'
[//]: #
[//]: # 'To build a production version'
[//]: #
[//]: # '1. Make build script executable'
[//]: # '   ```sh'
[//]: # '   chmod +x build.sh'
[//]: # '   ```'
[//]: # '2. Build project'
[//]: # '   ```sh'
[//]: # '   ./build.sh'
[//]: # '   ```'
[//]: # '3. Run build version'

## Documentation

_For more examples, please refer to the [Documentation](https://github.com/devylab/bluga)_

<!-- ROADMAP -->

## Report a bug

See the [open issues](https://github.com/devylab/bluga/issues) for a full list of proposed features (and known issues) or create a [new issue](https://github.com/devylab/bluga/issues/new).

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See [License](https://github.com/devylab/bluga/blob/main/LICENSE) for more information.

<!-- CONTACT -->

## Contact

Cavdy - [@DarklordCodes](https://twitter.com/DarklordCodes)

Project Link: [https://github.com/devylab/bluga](https://github.com/devylab/bluga)

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [AdminLTE](https://adminlte.io/)
- [EJS](https://ejs.co/)
- [Prisma](https://www.prisma.io/)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/devylab/bluga.svg?style=for-the-badge
[contributors-url]: https://github.com/devylab/bluga/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/devylab/bluga.svg?style=for-the-badge
[forks-url]: https://github.com/devylab/bluga/network/members
[stars-shield]: https://img.shields.io/github/stars/devylab/bluga.svg?style=for-the-badge
[stars-url]: https://github.com/devylab/bluga/stargazers
[issues-shield]: https://img.shields.io/github/issues/devylab/bluga.svg?style=for-the-badge
[issues-url]: https://github.com/devylab/bluga/issues
[license-shield]: https://img.shields.io/github/license/devylab/bluga?style=for-the-badge
[license-url]: https://github.com/devylab/bluga/blob/main/LICENSE
[product-screenshot]: images/screenshot.png
[nodejs]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[nodejs-url]: https://nodejs.org/en
[fastify]: https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white
[fastify-url]: https://fastify.dev/
