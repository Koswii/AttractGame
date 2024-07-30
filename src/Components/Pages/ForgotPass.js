import React,{ useEffect,useState } from 'react'
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CSS/forgotpass.css'

const ForgotPass = () => {

const [codeReceive,setCodeReceive] = useState(false)
const [newPassword,setNewPassword] = useState("")
const [confirmPassword,setConfirmPassword] = useState("")

const { code } = useParams();

useEffect(() => {
    const recovery = localStorage.getItem("recoveryCode")
    const codeSent = "recovery-code="+recovery

    if (codeSent === code) {
        setCodeReceive(true)
    }
}, [])

const handleNewPass = (event) => {
    setNewPassword(event.target.value)
}
const handleConfirmPass = (event) => {
    setConfirmPassword(event.target.value)
}

const navigate = useNavigate ();
const [changeResult,setChangeResult] = useState()

const changePassword = async (e) => {
    e.preventDefault()

    if (!newPassword && !confirmPassword) {
        setChangeResult('no password found')
    } else if(
        newPassword === confirmPassword){const email = localStorage.getItem('changeEpass')
        const passwordUpdate = {
            email: email,
            newpassword: confirmPassword
        }
        const fgLinkg = process.env.REACT_APP_AG_FORGOT_PASS_API
        console.log(fgLinkg,passwordUpdate);
        try {
            axios.post(fgLinkg, passwordUpdate).then((response) => {
                console.log(response);
            })
            localStorage.setItem('recoveryCode', '')
            localStorage.setItem('changeEpass', '')
            setChangeResult('You have successfully change your password')
            setTimeout(() => {
                navigate('/')
            }, 3000);
        } catch (error) {
            console.log(error);
            setChangeResult(error)
        }
    } else {
        setChangeResult('Password not match')
    }
}

  return (
    <div>
      {codeReceive &&(
        <div className="changePassword">
            <div className="changePass-contents">
                <h1>Change your password</h1>
                <hr />
                <section>
                    <form onSubmit={changePassword}>
                        <p>New Password</p>
                        <input type="password" placeholder='new password' value={newPassword} onChange={handleNewPass}/>
                        <p>Confirm Password</p>
                        <input type="password" placeholder='confirm password' value={confirmPassword} onChange={handleConfirmPass}/>
                        {changeResult&&(<span>{changeResult}</span>)}
                        <br />
                        <button type='submit'>Change Password</button>
                    </form>
                </section>
            </div>
        </div>
      )}
    </div>
  )
}

export default ForgotPass
