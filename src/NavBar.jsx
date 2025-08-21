import React,{useState} from "react";

function NavBar (){

   const [value ,setvalue] = useState(false);
    
      
     

    return(
      <nav className="absolute top-0 left-0 bg-gray-100 text-blue-600 p-4 shadow-md min-w-full">
        <div className=" flex justify-between ">
          <h1 className=" text-xl font-bold">
            SPLITWISE
          </h1>
          <div className="relative">
            <button onClick={()=>setvalue(!value)} className="flex items-center text-amber-50 "><span>Menue</span></button>
            {value && (<div className="bg-amber-100 absolute right-0 mt-2 w-40 text-blue-600  text- rounded-md shadow-lg z-10">
            <a href="#" className="block px-4 py-2  hover:bg-gray-300">Contact</a>
            <a href="#" className="block px-4 py-2  hover:bg-gray-300">About</a>
            <a href="#" className="block px-4 py-2  hover:bg-gray-300">Login</a>
            <a href="#" className="block px-4 py-2  hover:bg-gray-300">Sign-Up</a>
            </div>
            )}
            
          </div>
        </div>
      </nav>
    )
    ;
    
}
export default NavBar;
