import React from 'react'
import gameicon from '../assets/gameicon.png'
import './SendGameToAdmin.css'
import PartHeading from '../components/PartHeading/PartHeading'
import Button from '../components/Button/Button'
let arr = ["https://t4.ftcdn.net/jpg/01/43/42/83/360_F_143428338_gcxw3Jcd0tJpkvvb53pfEztwtU9sxsgT.jpg","https://www.investopedia.com/thmb/T2DdeU_VWQIq2kX-fqCZa8qTUFU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Sample-Final-blue-6d294ab8024a4cdca8050cc58ab20c42.jpg","https://www.investopedia.com/thmb/T2DdeU_VWQIq2kX-fqCZa8qTUFU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Sample-Final-blue-6d294ab8024a4cdca8050cc58ab20c42.jpg","https://www.investopedia.com/thmb/T2DdeU_VWQIq2kX-fqCZa8qTUFU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Sample-Final-blue-6d294ab8024a4cdca8050cc58ab20c42.jpg","https://www.investopedia.com/thmb/T2DdeU_VWQIq2kX-fqCZa8qTUFU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Sample-Final-blue-6d294ab8024a4cdca8050cc58ab20c42.jpg","https://www.investopedia.com/thmb/T2DdeU_VWQIq2kX-fqCZa8qTUFU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Sample-Final-blue-6d294ab8024a4cdca8050cc58ab20c42.jpg"]
function SendGameToAdmin() {
  return (
    <>
    <div className='game-application'>
        <h1 >GAME APPLICATION</h1>
    </div>
    <div className='form-border'>
      <div className='game-mandatory-information'>
        <img className='game-avatar' src={gameicon} alt="" />
        <div className='name-price'>
            NAME
            <input type="text" name="game-name" id="" />
            PRICE
            <input type="text" name="game-price" id="" />
        </div>
      </div>
      <div className='sys-req'>
        <PartHeading content='SYSTEM REQUIREMENTS'/>
        <div className='sys-req-col-container'>
            <div className='sys-req-col1'>
                OS
                <input type="text" name="os" id="" />
                PROCESSOR
                <input type="text" name="processor" id="" />
                MEMORY
                <input type="text" name="memory" id="" />
            </div>
            <div className='sys-req-col2'>
                GRAPHICS
                <input type="text" name="graphics" id="" />
                STORAGE
                <input type="text" name="storage" id="" />
                ADDITIONAL NOTES
                <textarea name="notes" id=""></textarea>
            </div>
        </div>
      </div>
      <div className='summary'>
        <PartHeading content='SUMMARY'/>
        <textarea name="summary" id="" cols="30" rows="10"></textarea>
      </div>
      <div className='summary'>
        <PartHeading content='Description'/>
        <textarea name="summary" id="" cols="30" rows="10"></textarea>
      </div>
      <div className='game-assets'>
        <PartHeading content='ASSETS'/>
        <div className='inner-image'>
            {arr.map((item,index) => (
                <img src={item} alt="" key={index} />
            ))}
        </div>
      </div>
      <div className='game-file'>
        <PartHeading content='FILES'/>    
        <Button className='upload-button' label='UPLOAD'/>  
      </div>
      <div className='send-request-cancel'>
        <Button className='cancel-button' label='CANCEL'/>
        <Button className='send-button' label='SEND REQUEST' isApprove={'true'}/>
      </div>
    </div>
    </>
  )
}

export default SendGameToAdmin
