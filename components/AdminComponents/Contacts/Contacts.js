import { useState } from "react";
import ContactItem from "./ContactItem";

function Contacts ({contacts , endpoint , id}) {
    const [openAdd , setOpenAdd] = useState(false);

    return <div className="w-[90%] mx-auto flex flex-col justify-start items-center">
        <div className="w-[90%] mx-auto flex flex-wrap">
            {contacts.map((contact , i) => {
                return <ContactItem contact={contact} key={i}/>
            })}
            <div onClick={openAdd} className="w-[23%] m-1 rounded-full cursor-pointer border-2 border-black text-black hover:border-skin-primary hover:text-skin-primary" >
                Add A Contact
            </div>
        </div>
    </div>

}

export default Contacts ;