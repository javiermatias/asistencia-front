import { NextRequest } from "next/server";
import * as sgMail from '@sendgrid/mail';

export async function GET(request: NextRequest) {
    try {
        sgMail.setApiKey("");
    
        const msg = {
          to: 'javierjimenez78@gmail.com', // Change to your recipient
          from: 'ausentismo@smartsoft.online', // Change to your verified sender
          subject: 'This is a simple message',
          text: 'which contains some text',
          html: '<strongz>and some html</strongz>',
        }
        
        sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
    }catch(e){
        console.log(e);
    }
  
  

    return new Response(`Bitacora was save success!`, {
        status: 200
      })
  }