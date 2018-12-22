const datetimeFormat = {
  format: (data) => {
    return data[0] + '-' + data[1] + '-' + data[2] + 'T' + data[3] + ':' + data[4] + ':' + data[5]
  },
  toDate: (data) => {
    let year = parseInt(data.substring(0, 4))
    let month = parseInt(data.substring(5, 7))
    let date = parseInt(data.substring(8, 10))
    let hour = parseInt(data.substring(11, 13))
    let minute = parseInt(data.substring(14, 16))
    let second = parseInt(data.substring(17))
    return new Date(year, month, date, hour, minute, second)
  },
  toPretty: (data) => {
    return data.replace(/T/g, ' ')
  }
}

export default datetimeFormat
