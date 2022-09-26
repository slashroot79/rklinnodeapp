const BASE_URL = "http://localhost:5000"
//const BASE_URL = `https://rklinnodeapp.azurewebsites.net`

const reqType = {
    get:"GET",
    post:"POST",
    put:"PUT",
    delete:"DELETE",
    head:"HEAD"
}

const ctr = document.querySelector(".main-ctr .list-item-ctr")
const delBtn = document.getElementById("delete-btn")
const subBtn = document.querySelector(".main-ctr .submit-btn")
const inputTextElm = document.getElementById("text-input-item")
const progressBar = document.getElementById('p-bar')
const uploadBtn = document.querySelector('.fileupload .submit-btn')
const fileUploadStatusLabel = document.querySelector('.progress-bar label')
const uploadProgress = (pEvent)=>{
    const pvalue = (pEvent.loaded / pEvent.total)*100
    progressBar.setAttribute('value',pvalue) 
}

let inputText = ""
let dataItems = []

const updateUI = ()=>{
    clearUI()
    if (dataItems.length>1){
        delBtn.style.display = "block"
    }
    dataItems.forEach(item => {
        if(item && item !== " "){
            const textElm = document.createElement('p')
            textElm.innerText = item
            ctr.appendChild(textElm)
        }
    })
}

const clearUI = ()=>{
    while(ctr.firstChild){
        ctr.removeChild(ctr.firstChild)
    }
    delBtn.style.display = 'none'
}

const apiRequestHandler = (rType,path,data={}, config)=>{
    const url = new URL(BASE_URL+path)
    switch(rType){
        case 'GET':
            if(data && typeof(data) === "object"){
                Object.keys(data).forEach(key=>{
                    url.searchParams.append(key,data[key])
                })
            }else{
                console.log('Error: data needs to be an object')
                break;
            }
            fetch(url).then(apiGETResponseHandler).catch(apiErrorHandler)
            break;
        case 'POST':
            if(!data && typeof(data) !== "object"){
                console.log("Error: request object has to be 'object' type")
                break;
            }
            const jsonData = JSON.stringify(data)
            const pData = {
                method: 'POST',
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: jsonData
            }
            fetch(url,pData).then(apiPOSTResponseHandler).catch(apiErrorHandler)
            break;
        case 'DELETE':
            const dData = {
                method: 'DELETE',
            }
            fetch(url,dData).then(apiDELResponseHandler).catch(apiErrorHandler)
            break;
        default:
            break;
    }
}

const apiGETResponseHandler = (res)=>{
    res.json().then(data=>{
        dataItems = data
        updateUI()
    }).catch(err=>{
        console.log(err)
    })
}

const apiPOSTResponseHandler = (res)=>{
    res.json().then(data=>{
        dataItems.push(data)
        updateUI()
    }).catch(err=>{
        console.log(err)
    })
}

const apiDELResponseHandler = (res)=>{
    dataItems = []
    clearUI()
    console.log("Deleted........")
}

const apiErrorHandler = (err)=>{
    console.log(err)
}

const sendBtnHandler = ()=>{
    inputText = inputTextElm.value
    apiRequestHandler(reqType.post, '/items',{data:inputText})
    inputTextElm.value = ""
    inputText = ""
}

const deleteAllBtnHandler = ()=>{
    apiRequestHandler(reqType.delete,'/items')
}

const uploadBtnHandler = ()=>{
    const form = document.getElementById('image-form')
    const fileup = document.getElementById('input-fileup')
    fileup.onclick = ()=>fileUploadStatusLabel.innerText = ""
    const file = fileup.files[0]
    console.log("file======>"+file)
    const payload = new FormData()
    payload.append('image',file)
    console.log("payload======>"+payload)
    const url = BASE_URL+`/images`
    axios({
        method: "post",
        url: url,
        data: payload,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress:uploadProgress
      }).then(res=>{
        console.log(`posted image....${res.body}`)
        setTimeout(() => {
            progressBar.setAttribute('value',10) 
        }, 1000);
    }).catch(()=>{
        console.log("error...........")
        progressBar.setAttribute('value',0)
        fileUploadStatusLabel.innerText = "File upload error..."
    })
}

window.onload = ()=>{
    apiRequestHandler(reqType.get,'/items')
    inputTextElm.addEventListener('keyup',(e)=>{
        console.log('clicked')
        if (e.key == 'Enter'){
            console.log('clicked')
            e.preventDefault()
            subBtn.click()
        }
    })
}

