
var syncWalletInfo;
function accountsChanged(accounts){
    if(localStorage.getItem("connected")){
        console.log("accountsChanged:", accounts)
        localStorage.setItem("currentAddr",accounts[0])
        syncWalletInfo()
    }
}

function networkChanged(network){
    if(localStorage.getItem("connected")){
        console.log("networkChanged:", network)
        localStorage.setItem("network", network)
        syncWalletInfo()
    }
}

export async function getNetwork(){
    try {
        let res = await window.unisat.getNetwork();
        localStorage.setItem("network",res)
      } catch (e) {
        console.log(e);
      }
}

export async function requestAccounts(){
    try {
        let accounts = await window.unisat.requestAccounts();
        console.log(accounts)
        localStorage.setItem("connected",true)
        localStorage.setItem("currentAddr", accounts[0])
        console.log(accounts)
        await getNetwork();
        window.unisat.on('accountsChanged', accountsChanged);
        window.unisat.on('networkChanged', networkChanged);
    } catch (e) {
        console.log('connect failed');
    }
    syncWalletInfo()
}

export async function connectUnisatWallet(_syncwallet) {
    console.log(localStorage.getItem("connected"))
    syncWalletInfo = _syncwallet;
    if (localStorage.getItem("connected") != null) {
        requestAccounts()
    }
    _syncwallet();
}
    
export async function changeNetwork(net){
    try {
        let res = await window.unisat.switchNetwork(net);
        console.log(res)
      } catch (e) {
        console.log(e);
      }
}