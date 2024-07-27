from fastapi import APIRouter
import json
import os
import google.generativeai as genai
from model.chatbot import ChatPayload
from PyPDF2 import PdfReader


chats_list: dict[int, ChatPayload] = {}
chatbot_router = APIRouter(prefix='/chatbot')


def extract_pdf_pages(pathname: str) -> list[str]:
    parts=[]
    file_len = len(os.listdir(pathname))
    while len(parts) <= file_len:
        parts.append([])  # Or any placeholder
    for index, item in enumerate(os.listdir(pathname)):
        parts[index].append(f"--- START OF PDF ${item}")
        with open(pathname+'/'+item, "rb") as file:
            reader=PdfReader(file)
            for page in reader.pages:
                parts[index].append(page.extract_text())
    return parts


# Route to add a item
@chatbot_router.post("/chat")
def start_chat(chat_id: int, chat_baru: str):
    chat_list= {item.chat_id: item.chat_history for item in chats_list.values()}
    
    genai.configure(api_key="AIzaSyAGBabpUEDGqfRRDlWySVl-sqQRWNcWvQo")
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=
        "Jelaskan langkah-langkah mitigasi yang dapat dilakukan sebelum, selama, dan setelah banjir" + 
        "Sarankan pengguna untuk mengikuti arahan dari otoritas setempat dan evakuasi jika diperlukan" +
        "Berikan tips dan panduan tentang bagaimana mempersiapkan diri menghadapi banjir, seperti membuat rencana evakuasi dan menyiapkan tas darurat." +
        "Informasikan tentang tanda-tanda peringatan dini banjir dan cara meresponnya." + 
        "Ajarkan pengguna cara mematikan sumber listrik dan gas untuk mencegah kebakaran selama banjir" +
        "Rekomendasikan daftar obat-obatan dasar yang harus ada dalam kotak P3K untuk situasi darurat." + 
        "Berikan informasi tentang kegunaan dan dosis obat-obatan umum seperti paracetamol, antibiotik, dan antiseptik." + 
        "Sarankan pengguna untuk menyimpan obat-obatan dalam tempat yang kering dan terlindung dari air." + 
        "Jawab pertanyaan dengan informasi yang akurat dan terkini berdasarkan sumber terpercaya" + 
        "Jika tidak memiliki informasi yang cukup, arahkan pengguna ke lembaga atau otoritas terkait yang dapat memberikan bantuan lebih lanjut" + 
        "Tetap tenang dan memberikan dukungan emosional kepada pengguna yang mungkin berada dalam situasi stres atau darurat."
        
    )
    if chat_id in chat_list.keys():
        chat = chat_list[chat_id]
    else:
        history = []
        for page in extract_pdf_pages('content'):
            history.append({
                'role' : "user",
                'parts' : ' '.join(page)
            })
        chat: genai.ChatSession= model.start_chat(history=history)  # type: ignore
        chats_list[chat_id] = ChatPayload(
            chat_id=chat_id,user_id = 1, chat_history=chat
        )

    response = chat.send_message(chat_baru, stream=False)
    return {"item": response.text}