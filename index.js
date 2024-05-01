const inputSlider=document.querySelector("[data-lengthSlider]")
let lengthDisplay=document.querySelector("[data-lengthNumber]")
let passwordDisplay=document.querySelector("[data-passwordDisplay]")
let copyBtn=document.querySelector("[data-copy]")
let copyMsg=document.querySelector("[data-copyMsg]")
let uppercaseCheck=document.querySelector("#uppercase")
let lowercaseCheck=document.querySelector("#lowercase")
let numbersCheck=document.querySelector("#numbers")
let symbolsCheck=document.querySelector("#character")
let indicator=document.querySelector("[data-indicator]")
let generateBtn=document.querySelector(".generatorBtn")
let allCheckBox=document.querySelectorAll("input[type=checkbox]")



let password="";
let passwordLength=10;
let checkCount=0;
handleSlider()
setIndicator("#ccc")

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    // const min=inputSlider.min;
    // const max=inputSlider.max;
    // inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%";
}

function setIndicator(color){
    indicator.style.background=color;
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function getRndNumber(){
    return getRndInteger(0,9)
}

function generateLowerCase(){
   return  String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
   return  String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    let s=['/','_','-','@','#','*'];
    let num=getRndInteger(0,5);
    return s[num];
}

function calcStrength(){
 let hasUpper=false;
 let hasLower=false;
 let hasNum=false;
 let hasSym=false;

 if(uppercaseCheck.checked)  hasUpper =true
 if(lowercaseCheck.checked)  hasLower =true
 if(numbersCheck.checked)  hasNum =true
 if(symbolsCheck.checked)  hasSym =true

 if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8){
    setIndicator("#0f0")
 }else if(
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >=6
 ){
    setIndicator("#ff0")
 }else{
    setIndicator("#f00")
 }

}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(a){
        copyMsg.innerText="Failed";
    }

    //make visible copied msg tag
    copyMsg.classList.add("active");

    //to make test copied invisible again
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}
  
inputSlider.addEventListener('input',function(e){
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener("click",()=>{
    if(passwordDisplay.value)
        copyContent();
})

function handleCheckBoxChange(){
    checkCount =0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    })

    //special condition
    if(passwordLength < checkCount){
        passwordLength =checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener("change",handleCheckBoxChange)
})

function shufflePassword(array){
    //fisher yates method
    for(let i=array.length -1 ;i> 0;i--){
        const j=Math.floor(Math.random() * (i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }

    let str="";
    array.forEach((el)=>{str += el});
    return str;
}

generateBtn.addEventListener("click",()=>{
    //no check box selected
    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount){
        passwordLength =checkCount;
        handleSlider();
    }

    //generate the actual password
    
    //remove old password
    password = "";

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generatelowercaseCheckCase();
    // }
    // if(numbersCheck.checked){
    //     password += getRndNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr=[];

    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(getRndNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    //compulsary addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    //remaining addition
    for(let i=0;i<passwordLength - funcArr.length;i++){
        let randIndex=getRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();
    }

    // console.log(password)
    //shuffle the password
    password=shufflePassword(Array.from(password));
    console.log(password)
    
    //show in UI
    passwordDisplay.value=password;

    //calculate strength
    calcStrength()
})




