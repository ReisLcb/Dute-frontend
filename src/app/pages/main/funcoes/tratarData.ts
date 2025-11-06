export function tratar_data(data:string){
    let dia = data.split("-")[2].split("T")[0]
    let mes = data.split("-")[1]
    let ano = data.split("-")[0]

        switch(mes){
        case '01':
            mes = 'jan';
            break;

        case '02':
            mes = 'fev';
            break;

        case '03':
            mes = 'mar';
            break;

        case '04':
            mes = 'abr';
            break;

        case '05':
            mes = 'mai';
            break;

        case '06':
            mes = 'jun';
            break;

        case '07':
            mes = 'jul';
            break;

        case '08':
            mes = 'ago';
            break;

        case '09':
            mes = 'set';
            break;

        case '10':
            mes = 'out';
            break;

        case '11':
            mes = 'nov';
            break;

        case '12':
            mes = 'dez';
            break;

        default:
            break;
        }

  return `${dia} ${mes} ${ano}`
}