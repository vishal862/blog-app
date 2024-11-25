import { useEffect } from "react";
import { useLocation } from "react-router-dom";

//pathname is basically the path from the url
//ex.http://example.com/about 
//here /about is the path
const ScrollToTop = ()=>{
    const {pathname} = useLocation();
    useEffect(() => {
        window.scrollTo(0,0)
    }, [pathname])
    return null;
}

export default ScrollToTop