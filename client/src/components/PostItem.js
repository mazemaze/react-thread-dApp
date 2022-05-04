import React, { useState } from 'react'
import classes from "./PostItem.module.css";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

function PostItem(props) {
    const [isOpended, setIsOpened] = useState(false);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [isFilled, setIsFilled] = useState(false);

    const [orgOpen, setOrgOpen] = useState(false);

    const [liked, setLiked] = useState(false);


    const validation = () => {
        if (title && content) {
            setIsFilled(true);

        } else {
            setIsFilled(false);
        }
        console.log(isFilled);
    }

    const handleAddButton = () => {
        if (!isOpended) {
            setIsOpened(true)
        } else {
            setIsOpened(false)
        }
    }

    const handleOrgButton = () => {
        if (!orgOpen) {
            setOrgOpen(true)
        } else {
            setOrgOpen(false)
        }
    }
    return (
        <div className={classes.container}>
            <div className={classes.leftContent}>
                <button className={classes.button} onClick={!isFilled ? handleAddButton : () => {
                    props.newPost(title, content)
                    setIsFilled(false)
                    setIsOpened(false)
                    setTitle("")
                    setContent("")
                }}>
                    {!isOpended ? "Add Post" : "Post"}
                </button>
                {isOpended ?
                    <div className={classes.form}>
                        <form>
                            <div>
                                <label>Title</label>
                                <br></br>
                                <input value={title} onChange={(e) => {
                                    setTitle(e.target.value)
                                    validation()
                                }} className={classes.input} type="text" />
                            </div>
                            <div>
                                <label>Content</label>
                                <br></br>
                                <textarea value={content} onChange={(e) => {
                                    setContent(e.target.value)
                                    validation()
                                }} className={classes.input + " " + classes.textfield} type="text" />
                            </div>
                        </form>
                    </div>
                    : null}
                <button className={classes.button} onClick={!isFilled ? handleOrgButton : () => {
                    props.newPost(title, content)
                    setIsFilled(false)
                    setIsOpened(false)
                    setTitle("")
                    setContent("")
                }}>

                    Create Group
                </button>
                {orgOpen ?
                    <div className={classes.form}>
                        <form>
                            <div>
                                <label>Title</label>
                                <br></br>
                                <input value={title} onChange={(e) => {
                                    setTitle(e.target.value)
                                    validation()
                                }} className={classes.input} type="text" />
                            </div>
                            <div>
                                <label>Content</label>
                                <br></br>
                                <textarea value={content} onChange={(e) => {
                                    setContent(e.target.value)
                                    validation()
                                }} className={classes.input + " " + classes.textfield} type="text" />
                            </div>
                        </form>
                    </div>
                    : null}

                <ul>
                    {props.orgList !== null ? props.orgList.map((e) => 
                    <li key={e.id}>
                        {e.name}
                    </li>) : null}
                </ul>
            </div>
            <div className={classes.content}>
                {props.posts !== null ? <ul className={classes.list}>
                    {props.posts.map((e) =>
                        <li className={classes.item} key={e.id}>
                            <h1>{e.title}</h1>
                            <p>{e.content}</p>
                            <button className={classes.likeButton} onClick={() => props.likeButton(e.id)}>
                                {(props.isLiked(e.id).then((value) => setLiked(value))) ? <AiOutlineHeart /> : <AiFillHeart />}{e.likes}
                            </button>
                        </li>)}
                </ul> : null}
            </div>
        </div>
    )
}

export default PostItem