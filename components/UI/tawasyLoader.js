import Image from 'next/image';
import Loader from '../../public/images/tawasyLoader.gif'

function TawasyLoader (props) {

    return <div className='w-full h-full flex flex-col justify-center items-center' >
        <Image src={Loader} width={props.width ? props.width : 800} height={props.height ? props.height : 800} />
        {/* <img src={Loader} alt='loader' /> */}
    </div>

}

export default TawasyLoader ; 