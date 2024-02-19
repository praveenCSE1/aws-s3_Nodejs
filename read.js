const fs = require('fs')

const read = async ()=>{

    let data = fs.createReadStream('./example.csv')

    let buffer;
    data.on('data',(chunk)=>{

       buffer = chunk
       console.log(buffer);

       st =0

    console.log(buffer[0]+'dddd')

    for(st=0;st<buffer.length;st++){

        let print = ''

        if(buffer[st]==='/n'){

            print = buffer.slice(st)
    
        }
    }
    })

    
    
}

read()
