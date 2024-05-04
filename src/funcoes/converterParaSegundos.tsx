export const converterParaSegundos = (minutagem: string) => {
    const temDoisPontos = minutagem.includes(':');

    if (temDoisPontos) {
      const partes = minutagem.split(':');

      const minutos = parseInt(partes[0], 10);
      const segundos = parseInt(partes[1], 10);

      const totalSegundos = minutos * 60 + segundos;

      return totalSegundos;
    } else {
      return parseInt(minutagem, 10);
    }
  };
