const convertToNumber = (val) => {
  console.log(val)
  console.log(typeof val)
    const arr = val.split(".").join("").split("")

    if(arr.includes(",")){
      
      const indComm = arr.indexOf(",")
      arr[indComm] = "."
    }

    const res = arr.join("")
    const num = Number(res).toFixed(2)
    return Number(res)
}

const converToString = (val) => {
  console.log(val)
  console.log(typeof val)
  if(val === 0) return "0,00"
  const arr = val.toString().split("")
  const len = arr.length
  const indexOfDott = arr.indexOf(".")

  if(indexOfDott > 0){
    const firstHalfLen = arr.slice(0,indexOfDott).length
    arr[indexOfDott] = ","
    let firstHalf = arr.slice(0,2).join("")
    let secondHalf = arr.slice(2,len).join("")

    const lenDott = arr.slice(indexOfDott).length
    if(val < 0){
      if(firstHalfLen < 5){
        if(lenDott < 3) return arr.join("") + "0"
        else return arr.join("")
      }
      if(firstHalfLen === 5){
        if(lenDott < 3) return firstHalf + "." + secondHalf + "0"
        else return firstHalf + "." + secondHalf
      }
      if(firstHalfLen === 6){
        firstHalf = arr.slice(0,3).join("")
        secondHalf = arr.slice(3,len).join("")
        if(lenDott < 3) return firstHalf + "." + secondHalf + "0" 
        else return firstHalf + "." + secondHalf 
      }
      if(firstHalfLen === 7){
        firstHalf = arr.slice(0,4).join("")
        secondHalf = arr.slice(4,len).join("")
        if(lenDott < 3) return firstHalf + "." + secondHalf + "0" 
        else return firstHalf + "." + secondHalf 
      }
    }else if(val > 0){
      if(firstHalfLen < 4){
        if(lenDott < 3) return arr.join("") + "0"
        else return arr
      }
      if(firstHalfLen === 4){
        let firstHalf = arr.slice(0,1).join("")
        let secondHalf = arr.slice(1,len).join("")
        if(lenDott < 3) return firstHalf + "." + secondHalf + "0"
        else return firstHalf + "." + secondHalf
      }
      if(firstHalfLen === 5){
        let firstHalf = arr.slice(0,2).join("")
        let secondHalf = arr.slice(2,len).join("")
        if(lenDott < 3) return firstHalf + "." + secondHalf + "0"
        else return firstHalf + "." + secondHalf
      }
      if(firstHalfLen === 6){
        let firstHalf = arr.slice(0,3).join("")
        let secondHalf = arr.slice(3,len).join("")
        if(lenDott < 3) return firstHalf + "." + secondHalf + "0"
        else return firstHalf + "." + secondHalf
      }
    }
  } else {

    // negative Numbers no punct
    if(val < 0){
      let firstHalf = arr.slice(0,2).join("")
      let secondHalf = arr.slice(2,len).join("")
      if(len < 5) return val + ",00"
      if(len === 5) return firstHalf + "." + secondHalf + ",00"
      if(len === 6){
        firstHalf = arr.slice(0,3).join("")
        secondHalf = arr.slice(3,len).join("")
        return firstHalf + "." + secondHalf + ",00"
      } 
      if(len === 7){
        firstHalf = arr.slice(0,4).join("")
        secondHalf = arr.slice(4,len).join("")
        return firstHalf + "." + secondHalf + ",00"
      }
    }
    // positve Numbers no punct
    if(val > 0){
      let firstHalf = arr.slice(0,1).join("")
      let secondHalf = arr.slice(1,len).join("")
      if(len < 4) return val + ",00"
      if(len === 4) return firstHalf + "." + secondHalf + ",00"
      if(len === 5) {
        let firstHalf = arr.slice(0,2).join("")
        let secondHalf = arr.slice(2,len).join("")
        return firstHalf + "." + secondHalf + ",00"
      }
      if(len === 6) {
        let firstHalf = arr.slice(0,3).join("")
        let secondHalf = arr.slice(3,len).join("")
        return firstHalf + "." + secondHalf + ",00"
      }
    }
  }
}


export default {
    convertToNumber,
    converToString,
}