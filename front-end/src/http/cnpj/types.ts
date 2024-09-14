export interface CnaeSecundario {
  codigo: number
  descricao: string
}

export interface Socio {
  identificador_de_socio: number
  nome_socio: string
  cnpj_cpf_do_socio: string
  codigo_qualificacao_socio: number
  percentual_capital_social: number
  data_entrada_sociedade: string
  cpf_representante_legal?: string | null
  nome_representante_legal?: string | null
  codigo_qualificacao_representante_legal?: number | null
}

export interface CNPJApiResponse {
  cnpj: string
  identificador_matriz_filial: number
  descricao_matriz_filial: string
  razao_social: string
  nome_fantasia: string
  situacao_cadastral: number
  descricao_situacao_cadastral: string
  data_situacao_cadastral: string
  motivo_situacao_cadastral: number
  nome_cidade_exterior?: string | null
  codigo_natureza_juridica: number
  data_inicio_atividade: string
  cnae_fiscal: number
  cnae_fiscal_descricao: string
  descricao_tipo_de_logradouro: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cep: number
  uf: string
  codigo_municipio: number
  municipio: string
  ddd_telefone_1: string
  ddd_telefone_2?: string | null
  ddd_fax?: string | null
  qualificacao_do_responsavel: number
  capital_social: number
  porte: number
  descricao_porte: string
  opcao_pelo_simples: boolean
  data_opcao_pelo_simples?: string | null
  data_exclusao_do_simples?: string | null
  opcao_pelo_mei: boolean
  situacao_especial?: string | null
  data_situacao_especial?: string | null
  cnaes_secundarios: CnaeSecundario[]
  qsa: Socio[]
}
