const About = () => {
  return ( 
  <div className = "about">
    <div className = "inspiration">
      <h3>Inspiration</h3>
      <p>FinalSay was born out of frustration; a moment at a high school DECA competition where a passionate debate ended in a loss, with no explanation from the judge. It wasn’t just a loss, it felt like a missed opportunity to grow. That moment sparked a question: what if there was a way to grow and gain feedback before we had presented.</p>
      <p>FinalSay is our answer. It's an AI-powered debate coach that listens, analyzes, and challenges your arguments with real-time rebuttals, helping students sharpen their critical thinking and become more persuasive communicators. By combining cutting-edge language models with intuitive design, FinalSay simulates a live debate environment, minus the unpredictability of subjective judging.</p>
    </div>
    <div className = "what-it-does">
      <h3>What It Does</h3>
      <p>FinalSay is more than just an AI Chatbot, it acts as a real time debate couch, giving you continuous feedbacks and rebuttals to improve your critical thinking. FinalSay is a full-stack web application built using ReactJS and FastAPI, designed to help students improve their debate skills through real-time, structured feedback. At its core, the system handles live user input, processes it through a custom backend pipeline, and delivers targeted critiques; exactly like a real debate coach or partner. </p>
      <p>The backend is built with FastAPI to handle clean, scalable API routes and integrates retrieval-based logic to utilize contextually relevant information from curated knowledge sources. This significantly improves the relevance and accuracy of responses while minimizing generic or hallucinated output. To keep feedback grounded and fair, we implemented a cross-verification process using both GPT-4o and Gemini Flash 2.0 through LangChain. Instead of relying on a single model, FinalSay compares outputs from both, flags inconsistencies, and uses logic-based filtering to reduce bias. Arguments are evaluated using a custom judging framework modeled after the "Triple Bottom Line", weighing social, economic, and environmental dimensions. This multi-factor analysis is embedded in the feedback loop, allowing our system to highlight logical gaps, emotional appeals, and structural weaknesses in user responses.</p>
      <p>On the frontend, we used ReactJS to build a clean, responsive interface that supports live debate interactions. Users submit arguments, receive structured rebuttals or questions, and this allows students develop critical thinking  in real time. FinalSay is a fully engineered system built to replicate the experience of practicing with a critical, unbiased debate partner, designed for real students, not just AI demos.</p>
    </div>
    <div className = "meet-the-team">
      <h3>Meet the Team</h3>
      <h4>Kai Song</h4>
      <p>Kai is the co-founder of FinalSay, and a passionate student in the CS program at Carleton University. Kai spearheaded the backend development and AI integration for FinalSay, architecting the core system with FastAPI to ensure a robust and scalable REST API. Engineering a LLM- cross verification pipeline that minimizes hallucinations and improves response accuracy by retrieving relevant debate materials. His work focused on making the AI not only intelligent but also reliable and fair for every user.</p>
      <h4>Angelo Rivera</h4>
      <p>Angelo the co-founder of FinalSay, a student from McMaster University in the Mechatronics Engineering program is the technical powerhouse behind FinalSay. Angelo bridges frontend and backend development to deliver a smooth and responsive user experience using ReactJS. Allowing seamless integration with advanced AI models from OpenAI and Gemini via LangChain. Committed to strategic and reliable applications Angelo ensures that our applications technical solutions align with real user needs and create a meaningful learning experience.</p>
      <h4>Manya Hukkoo</h4>
      <p>Manya the co-founder of FinalSay, a student from McMaster University in the Electrical Engineering program makes sure the power of FinalSay feels effortless to use. She focuses on clean design, smooth user flows, and turning complex AI feedback into something any student can actually use and understand. Manya also integrated multiple large language models, including Gemini-Flash 2.0 and GPT-4o, implementing cross-verification to detect and reduce bias in AI feedback. Committed to empowering students Manya ensures that FinalSay delivers intelligent, fast, and reliable feedback allowing students to develop critical thinking and debating skills in an accessible and responsible way.</p>
    </div>
  </div> );
}
 
export default About;