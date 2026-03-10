# Geração TF pela Terefa com VDC
#### Dados Obrigatórios no TF vs Disponíveis na Tarefa

| Dado do TF | Na Tarefa? | Fonte na Tarefa |
|---|---|---|
| Caracterização (animal/vegetal) | SIM | `Campo Tipo de Tarefa` |
| Fiscal responsável | SIM | `Funcionário Responsável` |
| Respostas VDC | SIM | `Checklist Resposta Tarefa (VDC)` |
| Propriedade/Local | <span style="color:orange">SIM, porém NÃO OBRIGATÓRIO</span> | `Campo Local da Tarefa` |
| Coordenadas geográficas | <span style="color:orange">Sim, depende do Local</span> | Derivável da propriedade |
| Tipo identificação (prop/empresa/etc) | <span style="color:red">NÃO</span> | Precisa ser definido |
| Município fiscalizado | <span style="color:red">NÃO</span> | Derivável da inscrição estadual |
| Localização emissão (In Loco / Remota) | <span style="color:red">NÃO</span> | Não existe na tarefa |
| Objetivos de fiscalização (Programa, Objetivo, Subobjetivo) | <span style="color:red">NÃO</span> | Não há mapeamento |
| Dados Complementares: Situação Encontrada/Orientações | <span style="color:red">NÃO</span> | Precisa ser preenchido no TF |
