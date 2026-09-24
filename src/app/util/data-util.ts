export interface ValidacaoData {
    valido: boolean;
    mensagem?: string;
    dataFormatada: string;
}

export class DataUtil {
    static hoje = new Date();

    static obterDataAtualFormatada(tipo: string): string {
        const dia = this.hoje.getDate() < 10 ? `0${this.hoje.getDate()}` : String(this.hoje.getDate());
        const mes = (this.hoje.getMonth() + 1) < 10 ? `0${(this.hoje.getMonth() + 1)}` : String(this.hoje.getMonth() + 1);
        const ano = this.hoje.getFullYear();
        if (tipo === 'dia')
            return `${dia}-${mes}-${ano}`;
        else if (tipo === 'mes')
            return `${mes}-${ano}`;
        else
            return `${ano}`;
    }

    static obterDiaAtual(): string {
        return this.hoje.getDate() < 10 ? `0${this.hoje.getDate()}` : String(this.hoje.getDate());
    }

    static obterMesAtual(): string {
        return (this.hoje.getMonth() + 1) < 10 ? `0${(this.hoje.getMonth() + 1)}` : String(this.hoje.getMonth() + 1);
    }

    static obterAnoAtual(): string {
        return this.hoje.getFullYear().toString();
    }

    static validarPeriodoDia(periodo: string): ValidacaoData {
        let caracteres = periodo.length;
        // Verficacao do dia
        let dia = periodo;
        if (!(caracteres == 2 || caracteres == 5 || caracteres == 10)) {
            return { valido: false, mensagem: "Data mal formatada", dataFormatada: periodo };
        }
        else if (caracteres >= 2) {
            const datas = periodo.split("-");
            dia = datas[0];
            if (Number(dia) < 1 || Number(dia) > 31) {
                return { valido: false, mensagem: "Dia inválido", dataFormatada: periodo };
            }
            else if (caracteres == 2) {
                periodo = `${periodo}-${this.obterMesAtual()}-${this.obterAnoAtual()}`;
                caracteres = periodo.length;
            }
            else if (caracteres == 5) {
                periodo = `${periodo}-${this.obterAnoAtual()}`;
                caracteres = periodo.length;
            }
        }

        // Verficacao do mes
        let mes;
        if (caracteres >= 5) {
            const datas = periodo.split("-");
            mes = datas[1];
            let mesAtual = Number(this.obterMesAtual());
            let diaAtual = Number(this.obterDiaAtual());
            if (Number(mes) < 1 || Number(mes) > 12) {
                return { valido: false, mensagem: "Mês inválido", dataFormatada: periodo };
            } else if ((Number(dia) > diaAtual) && (Number(mes) >= mesAtual) || (Number(mes) > mesAtual)) {
                return { valido: false, mensagem: "Data inválida", dataFormatada: periodo };
            }
            let anoPeriodo = datas[2];
            if ((Number(mes) != mesAtual) && (Number(dia) > this.diasNoMes(Number(mes), Number(anoPeriodo)))) {
                return { valido: false, mensagem: "Data inválida", dataFormatada: periodo };
            }
        }

        // Verficacao do ano
        let ano = periodo;
        if (caracteres == 10) {
            const datas = periodo.split("-");
            ano = datas[2];
            if (Number(ano) < 2000 || Number(ano) > new Date().getFullYear()) {
                return { valido: false, mensagem: "Ano inválido", dataFormatada: periodo };
            }
        }

        return { valido: true, dataFormatada: periodo };
    }

    static validarPeriodoMes(periodo: string): ValidacaoData {
        let caracteres = periodo.length;
        // Verficacao do mes
        let mes = periodo;
        if (!(caracteres == 2 || caracteres == 7)) {
            return { valido: false, mensagem: "Data mal formatada", dataFormatada: periodo };
        } else if (caracteres >= 2) {
            const datas = periodo.split("-");
            mes = datas[0];
            if (Number(mes) < 1 || Number(mes) > 12) {
                return { valido: false, mensagem: "Mês inválido", dataFormatada: periodo };
            }
            let mesAtual = Number(this.obterMesAtual());
            let anoPeriodo;
            if (caracteres == 7)
                anoPeriodo = datas[1];
            else {
                anoPeriodo = this.obterAnoAtual();
                periodo = `${periodo}-${anoPeriodo}`;
                caracteres = periodo.length;
            }
            if (Number(mes) > mesAtual && Number(anoPeriodo) >= Number(this.obterAnoAtual())) {
                return { valido: false, mensagem: "Data inválida", dataFormatada: periodo };
            }
        }

        // Verficacao do ano
        let ano = periodo;
        if (caracteres == 7) {
            const datas = periodo.split("-");
            ano = datas[1];
            if (Number(ano) < 2000 || Number(ano) > new Date().getFullYear()) {
                return { valido: false, mensagem: "Data inválida", dataFormatada: periodo };
            }
        }

        return { valido: true, dataFormatada: periodo };
    }

    static validarPeriodoAno(periodo: string): ValidacaoData {
        const caracteres = periodo.length;
        let ano = periodo;
        if (caracteres == 4) {
            if (Number(ano) < 2000 || Number(ano) > new Date().getFullYear()) {
                return { valido: false, mensagem: "Ano inválido", dataFormatada: periodo };
            }
            else {
                return { valido: true, dataFormatada: periodo };
            }
        }
        else {
            return { valido: false, mensagem: "Data mal formatada", dataFormatada: periodo };
        }
    }

    static diasNoMes(mes: number, ano: number): number {
        return new Date(ano, mes, 0).getDate();
    }
}