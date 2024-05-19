function loadCsChat(url) {

    const CrossOriginLocalStorage = function(currentWindow, iframe, onMessage) {
        let childWindow;
        try {
            childWindow = iframe.contentWindow;
        } catch(e) {
            childWindow = iframe.contentWindow;
        }
        currentWindow.onmessage = (event) => {
            return onMessage(JSON.parse(event.data), event);
        };
        this.getData = (key) => {
            const messageData = {
                key: key,
                method: 'get',
            }
            this.postMessage(messageData);
        }
        this.setData = (key, data) => {
            const messageData = {
                key: key,
                method: 'set',
                data: data,
            }
            this.postMessage(messageData);
        }
        this.postMessage = (messageData) => {
            childWindow.postMessage(JSON.stringify(messageData), '*');
        }
    };



    const makediv = document.createElement('div')
    makediv.setAttribute('id', 'box-chat-cs-id')
    makediv.setAttribute('z-index', 99999999999999)
    makediv.style.width = '150px'
    makediv.style.height = '115px'
    makediv.style.display = 'block'
    makediv.style.position = 'fixed'
    makediv.style.bottom = '0px'
    makediv.style.right = '0px'
    makediv.style.zIndex = '99999999'
    document.body.appendChild(makediv)

    const ifrm = document.createElement('iframe')
    ifrm.setAttribute('id', 'iframe-chat')
    ifrm.setAttribute('src', url)
    ifrm.style.border = 'none'
    ifrm.style.width = '100%'
    ifrm.style.height = '100%'
    ifrm.style.margin = '0px'
    document.getElementById('box-chat-cs-id').appendChild(ifrm)

    const onMessage = (payload, event) => {
        const data = payload.data;
        switch (payload.method) {
        case 'get':
            if(data == true){
                document.getElementById("box-chat-cs-id").className = 'hidePopup';
                makediv.style.width = '150px'
                makediv.style.height = '110px'
            } else{
                document.getElementById("box-chat-cs-id").classList.remove('hidePopup');
                makediv.style.width = '342px'
                makediv.style.height = '620px'

		if (typeof payload.welcome_number !== 'undefined') {
                    let welcome_number = payload.welcome_number;
                    makediv.style.width = '380px'
                    makediv.style.height = '300px'
                    if (welcome_number == 1) {
                        makediv.style.height = '250px'
                    }
                    if (welcome_number == 2) {
                        makediv.style.height = '300px'
                    }
                }

            }

            break;
            default:
        }
    };

    const iframe = document.getElementsByTagName('iframe')[0];
    const cross = new CrossOriginLocalStorage(window, iframe, onMessage);
    cross.setData('name', 'buren')
    cross.getData('name')
}
