import * as ecc from 'tiny-secp256k1';
import { Buffer } from 'buffer';
const deployOpCode = 0;
const mintOpCode = 1;
const transferOpCode = 2;
const lockOpCode = 3;
const unlockOpCode = 4;
const serviceFeeAddrTestnet = "tb1pxxh8sph7uc9wgrdphg3ducuy3279mfjlga8derhxhu3qy5h96zmq7x7sra";
const serviceFeeAddrMainnet = "bc1p3lmyhsa4n5uep2ve6tq2l0hp78pxthjsqkk7mvscurtgya24nn2s55nwuj"
const serviceFee = 499;
bitcoin.initEccLib(ecc );
export function mintPsbt(utxos, fee, symbol, amount, senderAddr, reciveAddr, isMainnet) {
    var netconfig =  bitcoin.networks.testnet;
    var serviceFeeAddr = serviceFeeAddrTestnet;
    if(isMainnet){
        netconfig = bitcoin.networks.bitcoin;
        serviceFeeAddr = serviceFeeAddrMainnet;
    }
    const psbt = new bitcoin.Psbt({ network: netconfig })
    var allValue = 0;
    utxos.forEach((item, index, _) => {
        const uint8Array = new Uint8Array(item.raw.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        console.log(uint8Array);
        if(senderAddr.length > 40){
            psbt.addInput({
                hash: item.txid,
                index: item.vout,
                witnessUtxo: {script:bitcoin.address.toOutputScript(senderAddr, netconfig),value: item.value}
            })
        }else{
            psbt.addInput({
                hash: item.txid,
                index: item.vout,
                nonWitnessUtxo: Buffer.from(item.raw, "hex")
            })
        }
        allValue += item.value;
    });

    var mint_script = bitcoin.script.fromASM(
        `
        OP_RETURN 
        ${string2hex("hgp")} 
        ${number2hex(0)} 
        ${number2hex(1)} 
        ${number2hex(mintOpCode)} 
        ${string2hex(symbol)} 
        ${number2hex(amount)} 
        ${number2hex(0)} 
      `
          .trim()
          .replace(/\s+/g, ' '),
      );

    psbt.addOutput({
        script:mint_script,
        value:0,
    })

    psbt.addOutput({
        address: reciveAddr,
        value: 546
    })

    psbt.addOutput({
        address: serviceFeeAddr,
        value: serviceFee
    })

    psbt.addOutput({
        address: senderAddr,
        value: allValue-serviceFee-fee,
    })
    
    // console.log(psbt.toHex())
    return psbt.toHex()
    
}

export function transferPsbt(utxos, fee, symbol, amount, senderAddr, reciveAddr, isMainnet) {
    var netconfig =  bitcoin.networks.testnet;
    var serviceFeeAddr = serviceFeeAddrTestnet;
    if(isMainnet){
        netconfig = bitcoin.networks.bitcoin;
        serviceFeeAddr = serviceFeeAddrMainnet;
    }
    const psbt = new bitcoin.Psbt({ network: netconfig })
    var allValue = 0;
    utxos.forEach((item, index, _) => {
        const uint8Array = new Uint8Array(item.raw.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        console.log(uint8Array);
        if(senderAddr.length > 40){
            psbt.addInput({
                hash: item.txid,
                index: item.vout,
                witnessUtxo: {script:bitcoin.address.toOutputScript(senderAddr, netconfig),value: item.value}
            })
        }else{
            psbt.addInput({
                hash: item.txid,
                index: item.vout,
                nonWitnessUtxo: Buffer.from(item.raw, "hex")
            })
        }
        allValue += item.value;
    });

    var mint_script = bitcoin.script.fromASM(
        `
        OP_RETURN 
        ${string2hex("hgp")} 
        ${number2hex(0)} 
        ${number2hex(1)} 
        ${number2hex(transferOpCode)} 
        ${string2hex(symbol)} 
        ${number2hex(amount)}
      `
          .trim()
          .replace(/\s+/g, ' '),
      );

    psbt.addOutput({
        script:mint_script,
        value:0,
    })

    psbt.addOutput({
        address: reciveAddr,
        value: 546
    })

    psbt.addOutput({
        address: senderAddr,
        value: allValue-fee,
    })
    
    // console.log(psbt.toHex())
    return psbt.toHex()
    
}

export function chequePsbt(utxos, fee, symbol, amount, senderAddr, reciveAddr, isMainnet) {
    var netconfig =  bitcoin.networks.testnet;
    if(isMainnet){
        netconfig = bitcoin.networks.bitcoin;
    }
    const psbt = new bitcoin.Psbt({ network: netconfig })
    var allValue = 0;
    utxos.forEach((item, index, _) => {
        const uint8Array = new Uint8Array(item.raw.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        console.log(uint8Array);
        if(senderAddr.length > 40){
            psbt.addInput({
                hash: item.txid,
                index: item.vout,
                witnessUtxo: {script:bitcoin.address.toOutputScript(senderAddr, netconfig),value: item.value}
            })
        }else{
            psbt.addInput({
                hash: item.txid,
                index: item.vout,
                nonWitnessUtxo: Buffer.from(item.raw, "hex")
            })
        }
        allValue += item.value;
    });

    var mint_script = bitcoin.script.fromASM(
        `
        OP_RETURN 
        ${string2hex("hgp")} 
        ${number2hex(0)} 
        ${number2hex(1)} 
        ${number2hex(lockOpCode)} 
        ${string2hex(symbol)} 
        ${number2hex(amount)}
      `
          .trim()
          .replace(/\s+/g, ' '),
      );

    psbt.addOutput({
        script:mint_script,
        value:0,
    })

    psbt.addOutput({
        address: reciveAddr,
        value: 546
    })

    psbt.addOutput({
        address: senderAddr,
        value: allValue-546-fee,
    })
    
    // console.log(psbt.toHex())
    return psbt.toHex()
    
}

export function unchequePsbt(utxos, fee, symbol, senderAddr, reciveAddr, isMainnet) {
    var netconfig =  bitcoin.networks.testnet;
    if(isMainnet){
        netconfig = bitcoin.networks.bitcoin;
    }
    const psbt = new bitcoin.Psbt({ network: netconfig })
    var allValue = 0;
    utxos.forEach((item, index, _) => {
        const uint8Array = new Uint8Array(item.raw.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        console.log(uint8Array);
        if(senderAddr.length > 40){
            psbt.addInput({
                hash: item.txid,
                index: item.vout,
                witnessUtxo: {script:bitcoin.address.toOutputScript(senderAddr, netconfig),value: item.value}
            })
        }else{
            psbt.addInput({
                hash: item.txid,
                index: item.vout,
                nonWitnessUtxo: Buffer.from(item.raw, "hex")
            })
        }
        allValue += item.value;
    });

    var mint_script = bitcoin.script.fromASM(
        `
        OP_RETURN 
        ${string2hex("hgp")} 
        ${number2hex(0)} 
        ${number2hex(1)} 
        ${number2hex(unlockOpCode)} 
        ${string2hex(symbol)}
      `
          .trim()
          .replace(/\s+/g, ' '),
    );

    psbt.addOutput({
        script:mint_script,
        value:0,
    })

    psbt.addOutput({
        address: reciveAddr,
        value: 546
    })

    psbt.addOutput({
        address: senderAddr,
        value: allValue-546-fee,
    })
    
    // console.log(psbt.toHex())
    return psbt.toHex()
    
}

function string2hex(str) {
    let hexStr = ""
    for (let i = 0; i < str.length; i++) {
        hexStr += str.charCodeAt(i).toString(16)
    }
    if(hexStr.length%2!=0){
        hexStr = "0"+hexStr
    }
    console.log(hexStr)
    return hexStr;
}

function number2hex(n){
    var hexStr = n.toString(16);
    if(hexStr.length%2!=0){
        hexStr = "0"+hexStr
    }
    return hexStr;
}

export function TestScript(input) {
//     console.log(`
//     OP_RETURN 
//     ${string2buffer("hgp")} 
//     ${string2buffer("hgp")} 
//     ${number2hex("hgp")}  
//   `)
    var bf = bitcoin.script.fromASM(
        `
        OP_RETURN 
        ${string2hex("hgp")} 
        ${number2hex(0)} 
        ${number2hex(1)} 
        ${number2hex(0)} 
        ${string2hex("潇洒的")} 
        ${number2hex(0)} 
        ${number2hex(1000)} 
        ${number2hex(21000000)} 
        ${number2hex(210000)} 
        ${number2hex(220000)} 
        ${number2hex(0)} 
      `
          .trim()
          .replace(/\s+/g, ' '),
      );
      return bf.toString('hex');
}
// const { address } = bitcoin.payments.p2pkh({
//     pubkey: publicKey,
//     network: testnet
// })
// const privateKey = keyPair.toWIF()

// psbt.signInput(0, key)
// psbt.validateSignaturesOfInput(0)
// psbt.finalizeAllInputs()
// psbt.extractTransaction().toHex()