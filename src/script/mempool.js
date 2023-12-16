import axios from "axios";
function getHost(){
    if(localStorage.getItem("network") == "livenet"){
        return "https://mempool.space/api"
    }else{
        return "https://mempool.space/testnet/api"
    }
}

export async function getTxHex(txid) {
    var txhex = "";
    await axios
      .get( getHost() + "/tx/" + txid + "/hex")
      .then((response) => {
        txhex = response.data;
      })
      .catch(function (error) {
  
      });
    return txhex;
}

export async function getUnspentUtxo(address){
    var utxos = [];
    await axios
    .get(
        getHost() + "/address/" +
        address +
        "/utxo"
    )
    .then((response) => {
        utxos = response.data;
    })
    .catch(function (error) {

    });
    return utxos
}

export async function getFeeRates(){
    var feeRates = [1,1,1]
    await axios
    .get( getHost() +"/v1/fees/recommended")
    .then((response) => {
      feeRates[0] = response.data["halfHourFee"];
      feeRates[1] = response.data["fastestFee"];
      feeRates[2] = response.data["halfHourFee"];
    })
    .catch(function (error) {
      console.log("get feerate error");
    });
    return feeRates

}