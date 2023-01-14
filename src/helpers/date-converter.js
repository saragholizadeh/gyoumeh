module.exports = class Converter {
  timestampToSolar(timestamp) {
    var solarDate = new Date(timestamp*1000);
    var s = solarDate.toLocaleDateString('fa-IR');
    return s;
  }

  timestampToAD(timestamp) {}

};
