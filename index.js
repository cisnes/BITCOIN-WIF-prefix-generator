const chef = require("cyberchef");

/** 
    @desc Cyberchef operations
**/
const decimaltohex = [
    { 
        "op":"From Decimal",
        "args":["Space",false]
    },
    {
        "op":"To Hex",
        "args":["Space"]
    }
]

const hex = [
    {   
        "op": "From Hex",
        "args": ["Auto"] 
    },
    {   
        "op": "To Base58",
        "args": ["123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"] 
    }
]

/**
    @desc Generating prefixes for all decimals spanning from 1 to 255
    @return map with prefixes
**/
function generatePrefixes(decimal){
    let prefixes = new Array()

    let hexprefix = chef.bake(decimal, decimaltohex)
    
    let stringchecksum1 = new chef.Dish(`${hexprefix}00000000000000000000000000000000000000000000000000000000000000000000000000`)   // Type1 
    let stringchecksum2 = new chef.Dish(`${hexprefix}FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF`)   // Type2
    
    let stringchecksum3 = new chef.Dish(`${hexprefix}000000000000000000000000000000000000000000000000000000000000000000000000`)   // Type1 
    let stringchecksum4 = new chef.Dish(`${hexprefix}FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF`)   // Type2

    let encoded1 = chef.bake(stringchecksum1, hex).toString()          // Baking HEX to BASE58
    let encoded2 = chef.bake(stringchecksum2, hex).toString()          // Baking HEX to BASE58

    let encoded3 = chef.bake(stringchecksum3, hex).toString()          // Baking HEX to BASE58
    let encoded4 = chef.bake(stringchecksum4, hex).toString()          // Baking HEX to BASE58

    prefixes[0] = hexprefix
    prefixes[1] = encoded1.charAt(0)
    prefixes[2] = encoded2.charAt(0)
    prefixes[3] = encoded3.charAt(0)
    prefixes[4] = encoded4.charAt(0)
    return prefixes;
}

/**
    @desc Self invoking function passing decimals to function for generating prefixes
    @return array with prefixes
**/
(function() {
    console.log((1==2) ? "test" : "t")
    
    for(var i = 1; i <= 255; i++) {
        const prefixes = generatePrefixes(i)
        let compressed = (prefixes[1] == prefixes[2]) ? `${prefixes[1]}  ` : `${prefixes[1]}/${prefixes[2]}`
        let uncompressed = (prefixes[3] == prefixes[4]) ? `${prefixes[3]}  ` : `${prefixes[3]}/${prefixes[4]}`
        console.log(`Decimal prefix: ${i}   Hexprefix: ${prefixes[0]}    WIF-Prefix(compressed pubkey): ${compressed}   WIF-Prefix(uncompressed pubkey): ${uncompressed}`)
    }
}())