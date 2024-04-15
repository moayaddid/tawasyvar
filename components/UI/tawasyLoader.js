import Image from 'next/image';
import Loader from '../../public/images/tawasyLoader.gif'

function TawasyLoader ({width , height}) {

    return <div className='w-full h-full flex flex-col justify-center items-center' >
        <Image src={Loader} width={width ? width : 800} height={height ? height : 800} />
        {/* <img src={Loader} alt='loader' /> */}
    </div>

}

export default TawasyLoader ; 