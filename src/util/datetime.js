const datetimeFormat = {
  format: (data) => {
    return data[0] + '-' + data[1] + '-' + data[2] + 'T' + data[3] + ':' + data[4] + ':' + data[5]
  },
  toDate: (data) => {
    let year = parseInt(data.substring(0, 4))
    let month = parseInt(data.substring(5, 7)) - 1
    let date = parseInt(data.substring(8, 10))
    let hour = parseInt(data.substring(11, 13))
    let minute = parseInt(data.substring(14, 16))
    let second = parseInt(data.substring(17, 19))
    return new Date(year, month, date, hour, minute, second)
  },
  toPretty: (data) => {
    return data.replace(/T/g, ' ').substring(0, 19)
  },
  getToday: () => {
    let date = (new Date()).toISOString()
    let year = parseInt(date.substring(0, 4))
    let month = parseInt(date.substring(5, 7))
    let day = parseInt(date.substring(8, 10))
    return (new Date(year, month, day, 23, 59, 59)).toISOString().substring(0, 19)
  },
  toDateTime: (data) => {
    return data.toISOString().substring(0, 19)
  }
}

export default datetimeFormat
