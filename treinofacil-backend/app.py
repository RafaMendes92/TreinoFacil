import os
from typing import Any, Dict, Optional

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

load_dotenv()

app = FastAPI(title="TreinoFácil IA Coach", version="1.0.0")

allowed_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "*").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if "*" in allowed_origins or not allowed_origins else allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CoachRequest(BaseModel):
    message: str = Field(..., min_length=1)
    user: Optional[Dict[str, Any]] = None
    plan: Optional[Dict[str, Any]] = None


class CoachResponse(BaseModel):
    response: str


def build_local_response(payload: CoachRequest) -> str:
    user_name = (payload.user or {}).get("nome", "Atleta").split()[0]
    plan_obj = (payload.plan or {}).get("objetivo") or "condicionamento físico e saúde"
    plan_nivel = (payload.plan or {}).get("nivel") or "intermediário"
    content = payload.message.strip()

    lower = content.lower()
    if any(word in lower for word in ["cardio", "aerób", "aerob", "corrida", "esteira", "bike", "bicicleta", "pular corda"]):
        nivel_norm = str(plan_nivel).lower()
        minutos = 20 if "iniciante" in nivel_norm else 45 if "avançado" in nivel_norm or "avancado" in nivel_norm else 30
        sugestao = "caminhada rápida ou bike" if "iniciante" in nivel_norm else "intervalos leves de corrida, bike ou corda"
        tempo_plano = (payload.plan or {}).get("tempo") or 30
        return f"{user_name}, indico {minutos} min de cardio moderado ({sugestao}), respeitando sua meta de {tempo_plano} min/treino."
    if any(word in lower for word in ["quanto tempo", "tempo", "minutos", "dura"]):
        nivel_norm = str(plan_nivel).lower()
        tempo_plano = (payload.plan or {}).get("tempo") or 45
        faixa = "15 a 20" if "iniciante" in nivel_norm else "40 a 60" if "avançado" in nivel_norm or "avancado" in nivel_norm else "20 a 30"
        return f"{user_name}, mire sessões de ~{tempo_plano} min: 5 a 10 min de aquecimento, 30 a 40 de treino e 5 de alongamento. Cardio: {faixa} min."
    if any(word in lower for word in ["dor", "lesão", "lesao", "restrição", "restri", "recupera"]):
        return f"{user_name}, reduza a carga em 10% a 15% e evite movimentos que forcem a região afetada. Dor persistente deve ser avaliada por um profissional."

    topicos = [
        (["aquec"], "Aqueça 5 a 10 min: caminhada, polichinelos, mobilidade e séries leves do primeiro exercício."),
        (["descanso"], "Entre séries: 60 a 90s para força e 30 a 60s para cardio. Durma 7 a 8h por noite."),
        (["along"], "Alongue 5 a 10 min após o treino, segurando cada posição 20 a 30s, sem forçar."),
        (["água", "agua", "hidrata"], "Beba cerca de 2L de água por dia e alguns goles a cada 15-20 min durante o treino."),
        (["dieta", "aliment", "nutri", "comer"], "Priorize proteínas magras, carboidratos complexos e vegetais; faça uma refeição leve 1-2h antes do treino."),
        (["emagrecer", "perder", "gordura", "definir"], "Mantenha intensidade moderada, descansos curtos e adicione cardio em dias alternados."),
        (["massa", "força", "ganhar", "muscular"], "Use 3 a 4 séries por exercício, descanso de 60 a 90s e aumente a carga aos poucos."),
        (["overtraining", "excesso de treino", "treinar todo dia", "todos os dias"], "Treine cada músculo 2 a 3x por semana, alterne dias intensos e leves e respeite sinais de fadiga."),
        (["frequência", "frequencia", "quantas vezes", "dias de treino"], "Para hipertrofia, 3 a 5 treinos por semana; iniciantes podem começar com 3."),
        (["resultado", "ganho de músculo", "defini", "quanto tempo pra", "quanto tempo para"], "Ganhos de força em 3 a 4 semanas; mudança visual em 2 a 3 meses com treino, descanso e proteína."),
        (["peito", "peitoral", "supino"], "Peito: supino reto/inclinado + crucifixo ou flexão, 3 a 4 séries de 8 a 12 reps."),
        (["costas", "remada", "puxada"], "Costas: puxada frontal/barra fixa + remada curvada/baixa, 3 a 4 séries de 8 a 12 reps."),
        (["perna", "agachamento", "glúteo", "gluteo", "quadríceps", "posterior", "panturrilha", "stiff", "leg press"], "Pernas: agachamento/leg press + stiff, 3 a 4 séries de 8 a 12 reps; panturrilha em amplitude total."),
        (["ombro", "desenvolvimento", "elev"], "Ombros: desenvolvimento para força + elevação lateral, com execução controlada e sem compensar com a lombar."),
        (["bíceps", "biceps", "rosca"], "Bíceps: rosca direta + martelo/concentrada, cotovelos firmes e volta controlada."),
        (["tríceps", "triceps", "mergulho", "dips"], "Tríceps: pulley + testa/francês, extensão completa, 60 a 90s de descanso."),
        (["abdômen", "abdomen", "barriga", "core", "prancha"], "Abdômen: supra, infra, prancha e oblíquos em 3 a 4 séries; prancha de 30 a 60s."),
        (["musculação", "musculacao", "academia", "treino de força"], "Use 1 a 2 exercícios compostos por grupo muscular, 3 a 4 séries de 8 a 12 reps, progressão semanal e 48h de descanso por grupo."),
    ]

    melhor = None
    melhor_score = 0
    for keywords, resposta in topicos:
        score = sum(1 for kw in keywords if kw in lower)
        if score > melhor_score:
            melhor_score = score
            melhor = resposta

    if melhor:
        return f"{user_name}, {melhor}"
    return f"{user_name}, foque em execução correta, progressão semanal de carga e 7 a 8h de sono."


async def call_openai(payload: CoachRequest) -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return build_local_response(payload)

    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
    prompt = (
        "Pergunta do usuário: " + payload.message + "\n\n"
        f"Dados do usuário: {payload.user}\n\nDados do plano: {payload.plan}"
    )

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            f"{base_url.rstrip('/')}/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": model,
                "messages": [
                    {
                        "role": "system",
                        "content": "Você é um coach de fitness e personal trainer. Responda em português do Brasil, de forma CURTA e DIRETA (máx. 3 a 4 frases), com foco em treino, recuperação e progressão. Responda exatamente a pergunta, sem introduções longas.",
                    },
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.7,
                "max_tokens": 220,
            },
        )

    if response.status_code >= 400:
        return build_local_response(payload)

    data = response.json()
    content = (data.get("choices") or [{}])[0].get("message", {}).get("content")
    return content.strip() if content else build_local_response(payload)


@app.get("/health")
def health_check() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/api/coach", response_model=CoachResponse)
async def coach(payload: CoachRequest) -> CoachResponse:
    response_text = await call_openai(payload)
    return CoachResponse(response=response_text)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", "8000")),
        reload=True,
    )
