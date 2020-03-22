import React,{useEffect} from "react";
const Class = () => {
    useEffect(()=>{
        document.title = "分类";
    },[]);
    return (<main className='class-container'>
        <article>
            <h1>Class</h1>
        </article>
    </main>);
};
export default Class;
