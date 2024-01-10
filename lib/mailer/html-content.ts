export const verifyEmailContent = (name: string, token: string) => {
  const content = `<!DOCTYPE html>
<html lang="en">
  <head>
   
    <link
      href="https://fonts.googleapis.com/css?family=Pacifico"
      rel="stylesheet"
    />
  </head>
  <style>
    body {
      background-color: #1e1e1e;
    }
    h1.heading {
      font-size: 2rem;
      font-family: "Pacifico", cursive;
      color: #fff;
      font-weight: 100;
  
    }
    h1.heading span {
      font-weight: 900;
    }

    .container {
      display: flex;
      max-width: 1440px;
      margin: 0 auto;
      justify-content: center;
      align-items: center;
      flex-direction: column;

    }
    .content {
      background-color: #1a1616;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 2rem;
      width: 70%;
      border-radius: 1rem;
      margin-top: 2rem;
    }
    .header{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 2rem;
        width: 70%;
        border-radius: 1rem;
        margin-top: 2rem;
    }
    .para1 {
      color: #b3a9a9;
      font-family: Inter, sans-serif;
      font-size: 24px;
      text-align: center;
      font-style: normal;
      font-weight: 300;
      line-height: -100%;
    }
    .para2 {
      color: #b3a9a9;
      text-align: center;
      font-family: Inter;
      font-size: 20px;
      font-style: normal;
      font-weight: 300;
    }
    .headingpara {
      font-size: 2rem;
      font-family: Inter, sans-serif;
      color: #fff;
      font-weight: 200;
      margin-bottom: 0.5rem;
    }
    button {
      --glow-color: rgb(217, 176, 255);
      --glow-spread-color: rgba(191, 123, 255, 0.781);
      --enhanced-glow-color: rgb(231, 206, 255);
      --btn-color: rgb(100, 61, 136);
      border: 0.25em solid var(--glow-color);
      padding: 1em 3em;
      color: var(--glow-color);
      font-size: 15px;
      font-weight: bold;
      background-color: var(--btn-color);
      border-radius: 1em;
      outline: none;
      cursor: pointer;
      margin-top: 2rem;
      box-shadow: 0 0 1em 0.25em var(--glow-color),
        0 0 4em 1em var(--glow-spread-color),
        inset 0 0 0.75em 0.25em var(--glow-color);
      text-shadow: 0 0 0.5em var(--glow-color);
      position: relative;
      transition: all 0.3s;
    }

    button::after {
      pointer-events: none;
      content: "";
      position: absolute;
      top: 120%;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: var(--glow-spread-color);
      filter: blur(2em);
      opacity: 0.7;
      transform: perspective(1.5em) rotateX(35deg) scale(1, 0.6);
    }

    button:hover {
      color: var(--btn-color);
      background-color: var(--glow-color);
      box-shadow: 0 0 1em 0.25em var(--glow-color),
        0 0 4em 2em var(--glow-spread-color),
        inset 0 0 0.75em 0.25em var(--glow-color);
    }

    button:active {
      box-shadow: 0 0 0.6em 0.25em var(--glow-color),
        0 0 2.5em 2em var(--glow-spread-color),
        inset 0 0 0.5em 0.25em var(--glow-color);
    }
    .anime {
      animation: anime 1s infinite;
    }
    @keyframes anime {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
    .content img{
        width: 100%;
        max-width: 500px;
    }
  </style>
  <body>
    <main class="container">
      <div class="header">
        <img src="https://utfs.io/f/251f5134-afa5-48a5-8dc2-d1ea17403dfc-1zbfv.svg" alt="" />
        <h1 class="heading">Hi <span>${name}</span>,</h1>
        <p class="headingpara">please verify your email</p>
      </div>
      <div class="content">
        <p class="para1">
          Welcome to Brain Buzz, where knowledge meets engagement! We're
          thrilled to have you on board.
        </p>
        <img src="https://utfs.io/f/db83954e-6e19-4040-9abf-2a5e109395f4-1rd87u.png" alt="" class="anime" />
        <p class="para2">
          To complete your signup and unlock the full potential of Brain Buzz,
          please click on the following link:
        </p>
       
        <a href=${token} target="_blank"><button>Verify Email</button></a>
      </div>
    </main>
  </body>
</html>
`;
  console.log(content);

  return content;
};

export const TwoFactorEmailContent = (name: string, token: string) => {
  const codeWithSpans = token
    .split("")
    .map((digit) => `<span>${digit}</span>`)
    .join("");

  const content = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="style.css" />
    <link
      href="https://fonts.googleapis.com/css?family=Pacifico"
      rel="stylesheet"
    />
  </head>
  <style>
    body {
      background-color: #1e1e1e;
    }
    h1.heading {
      font-size: 2rem;
      font-family: "Pacifico", cursive;
      color: #fff;
      font-weight: 100;
    }
    h1.heading span {
      font-weight: 900;
    }

    .container {
      display: flex;
      max-width: 1440px;
      margin: 0 auto;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      min-height: 100vh;
    }
    .content {
      background-color: #1a1616;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 2rem;
      width: 70%;
      border-radius: 1rem;
      margin-top: 2rem;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 2rem;
      width: 70%;
      border-radius: 1rem;
      margin-top: 2rem;
    }
    .para1 {
      color: #b3a9a9;
      font-family: Inter, sans-serif;
      font-size: 24px;
      text-align: center;
      font-style: normal;
      font-weight: 300;
      line-height: -100%;
    }
    .para2 {
      color: #b3a9a9;
      text-align: center;
      font-family: Inter;
      font-size: 20px;
      font-style: normal;
      font-weight: 300;
    }
    .headingpara {
      font-size: 2rem;
      font-family: Inter, sans-serif;
      color: #fff;
      font-weight: 200;
      margin-bottom: 0.5rem;
    }

    .anime {
      animation: anime 1s infinite;
    }
    @keyframes anime {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
    .code {
      font-size: 3rem;
      font-family: Inter, sans-serif;
      color: #fff;
      font-weight: 200;
      margin-bottom: 0.5rem;
      display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }
    .code span {
      display: inline-block;
      border: 1px solid #fff;

      width: 50px;
      padding: 10px;
      text-align: center;
      margin: 0 0.1rem;
      border-radius: 5px;
    }
    .code {
        font-size: 3rem;
        font-family: Inter, sans-serif;
        color: #fff;
        font-weight: 200;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
      }
      
      .code span {
        display: inline-block;
        border: 1px solid #fff;
        width: 50px;
        padding: 10px;
        text-align: center;
        margin: 0 0.1rem;
        border-radius: 5px;
      }
      
      /* Media query for smaller screens */
      @media only screen and (max-width: 768px) {
        .code {
          font-size: 2rem;
          gap: 0.5rem;
        }
      
        .code span {
          width: 40px;
          padding: 8px;
        }
      }
      @media only screen and (max-width: 568px) {
        .code {
          font-size: 1.2rem;
          gap: 0.5rem;
        }
      
        .code span {
          width: 20px;
          padding: 4px;
        }

      }
      .content img{
        width: 100%;
        max-width: 500px;
    }
    </style>

  <body>
    <main class="container">
      <div class="header">
        <img src="./logo.svg" alt="" />
        <h1 class="heading">Hi <span>${name}</span>,</h1>
        <p class="headingpara">here’s your code to login</p>
      </div>
      <div class="content">
        <img
          src="https://utfs.io/f/f86c32ed-4b8c-4865-b49f-07174af78c19-1zbcb.png"
          alt=""
          class="anime"
        />
        <p class="para1">
          To complete the 2FA setup, please use the following code:
        </p>
        <h2 id="dynamicCode" class="code">${codeWithSpans}</h2>
      
        <p class="para2">
          If you did not initiate this setup, please contact our support team
          immediately at brainbuzz@gmail.com.
        </p>
      </div>
    </main>
   
  </body>
</html>
`;
  return content;
};

export const ResetEmailContent = (name: string, token: string) => {
  const content = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="style.css" />
    <link
      href="https://fonts.googleapis.com/css?family=Pacifico"
      rel="stylesheet"
    />
  </head>
  <style>
    body {
      background-color: #1e1e1e;
    }
    h1.heading {
      font-size: 2rem;
      font-family: "Pacifico", cursive;
      color: #fff;
      font-weight: 100;
  
    }
    h1.heading span {
      font-weight: 900;
    }

    .container {
      display: flex;
      max-width: 1440px;
      margin: 0 auto;
      justify-content: center;
      align-items: center;
      flex-direction: column;

    }
    .content {
      background-color: #1a1616;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 2rem;
      width: 70%;
      border-radius: 1rem;
      margin-top: 2rem;
    }
    .header{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 2rem;
        width: 70%;
        border-radius: 1rem;
        margin-top: 2rem;
    }
    .para1 {
      color: #b3a9a9;
      font-family: Inter, sans-serif;
      font-size: 24px;
      text-align: center;
      font-style: normal;
      font-weight: 300;
      line-height: -100%;
      margin-bottom: 2rem;
    }
    .para2 {
      color: #b3a9a9;
      text-align: center;
      font-family: Inter;
      font-size: 20px;
      margin-top: 5rem;
      font-style: normal;
      font-weight: 300;
    }
    .headingpara {
      font-size: 2rem;
      font-family: Inter, sans-serif;
      color: #fff;
      font-weight: 200;
      margin-bottom: 0.5rem;
    }
    button {
      --glow-color: rgb(217, 176, 255);
      --glow-spread-color: rgba(191, 123, 255, 0.781);
      --enhanced-glow-color: rgb(231, 206, 255);
      --btn-color: rgb(100, 61, 136);
      border: 0.25em solid var(--glow-color);
      padding: 1em 3em;
      color: var(--glow-color);
      font-size: 15px;
      font-weight: bold;
      background-color: var(--btn-color);
      border-radius: 1em;
      outline: none;
      cursor: pointer;
      margin-top: 2rem;
      box-shadow: 0 0 1em 0.25em var(--glow-color),
        0 0 4em 1em var(--glow-spread-color),
        inset 0 0 0.75em 0.25em var(--glow-color);
      text-shadow: 0 0 0.5em var(--glow-color);
      position: relative;
      transition: all 0.3s;
    }

    button::after {
      pointer-events: none;
      content: "";
      position: absolute;
      top: 120%;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: var(--glow-spread-color);
      filter: blur(2em);
      opacity: 0.7;
      transform: perspective(1.5em) rotateX(35deg) scale(1, 0.6);
    }

    button:hover {
      color: var(--btn-color);
      background-color: var(--glow-color);
      box-shadow: 0 0 1em 0.25em var(--glow-color),
        0 0 4em 2em var(--glow-spread-color),
        inset 0 0 0.75em 0.25em var(--glow-color);
    }

    button:active {
      box-shadow: 0 0 0.6em 0.25em var(--glow-color),
        0 0 2.5em 2em var(--glow-spread-color),
        inset 0 0 0.5em 0.25em var(--glow-color);
    }
    .anime {
      animation: anime 1s infinite;
    }
    @keyframes anime {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
    .content img{
        width: 100%;
        max-width: 500px;
    }
  </style>
  <body>
    <main class="container">
      <div class="header">
        <img src="https://utfs.io/f/251f5134-afa5-48a5-8dc2-d1ea17403dfc-1zbfv.svg" alt="" />
        <h1 class="heading">Hi <span>${name}</span>,</h1>
      
      </div>
      <div class="content">
        <p class="para1">
        We noticed that you've requested to reset your password for your Brain Buzz account. To proceed with the password reset, please follow the link below:
        </p>
       
        <a href=${token} target="_blank"><button>Reset Password</button></a>
        <p class="para2">
        If you did not initiate this request, please ignore this email. Your account security is important to us, and the link will expire in 2 hours, ensuring that it remains secure.
        </p>
      </div>
    </main>
  </body>
</html>
`;
  return content;
};
