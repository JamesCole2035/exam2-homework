/**
 * Для выполнения задания нужно установить Node JS (делается быстро и просто)
 * 
 * 
 * Дан список городов. Код для их получения в переменную написан. Вам нужно написать программу, которая будет выполняться следующим образом:
 * node ./cities.js "all where %number%>5" - выведет все города из списка с полем number у объектов городов которые соответствуют условию (вместо number могут быть region и city)
 * 
 * первое слово указывает максимальное количиство или позицию (Для first и second выводится одна запись) - all - все, first - первый, last - последний, цифра - количество, например
 * node ./cities.js "3 where %number%>5" - выведет в консоль 3 записи
 * node ./cities.js "first where %number%>5" - выведет в консоль первую запись
 * 
 * если слова where нет, например:
 * node ./cities.js "all"
 * то вывод работает без фильтрации, в примере выше выведутся в консоль все города.
 * Для удобства разбора (парсинга) строки с запросом рекомендую использовать regex
 * если задан неверный запрос (в примере ниже пропущено слово where но присутствует условие) выводится ошибка: wrong query
 * node ./cities.js "all %number%>5"
 * 
 * Операции для запроса могут быть: больше (>), меньше (<), совпадает (=)
 * 
 * ОТВЕТ ВЫВОДИТЬ В КОНСОЛЬ И ПИСАТЬ В ФАЙЛ OUTPUT.JSON (каждый раз перезаписывая)
 */

//Путь к файлу с городами
const LIST_OF_CITIES = "./cities.json";
const RESULT = "./output.json";

// Пакет node для чтения из файла
const fs = require("fs");

// тут мы получаем "запрос" из командной строки
const query = process.argv[2];

let cities = {};

// Чтение городов в переменную, запись в переменную производится в Callback-функции

fs.readFile(LIST_OF_CITIES, "utf8", (err, data) => {
    cities = data;
    cities = JSON.parse(cities);    
    //** вот где то тут пишите логику */ 
    processingQuery(query);
});
function processingQuery(str) {
    let regForString = /\s/;
    let strToArray = str.split(regForString);
    if (strToArray.length == 1) {
        const regForFirstParam = /all|first|second|last|\d/;
        if (regForFirstParam.test(strToArray[0])) {
            NumberOfCitiesForReturn(cities, strToArray, writeFile);         
        } else {
            throw new Error("Вы неправильно ввели условие");            
        } 
    } 
    else if (strToArray.length == 2) {
        throw new Error('Вы неправильно ввели условие и параметр');       
    } 
    else if (strToArray.length == 3) {
        const regForWhere = /where/;
        if (regForWhere.test(strToArray[1])) {
            const regForLimit = /(%number%[<>=]\d+$)|([%city%|%region%]=[а-яА-Я-.]+$)/;
            if (regForLimit.test(strToArray[2])) {
                strToArray[2]= strToArray[2].replace(/%/g,' ').trim();
                CitiesAfterParam(cities, strToArray, NumberOfCitiesForReturn);
            } else {
                throw new Error('Вы неправильно ввели параметр');  
            }
        } else {
            throw new Error('Вы неправильно ввели параметр: он обязательно должен начинаться с ключевого слова where');  
        }
    }
}

function CitiesAfterParam(arrResult, arrLimit, callback) {
    let limit = arrLimit[2];
    limit.split(/\s/);
    let arrFromLimit = limit.split(" ");
    let parametr = arrFromLimit[0];
    let parametrValue = arrFromLimit[1];
    let value = parametrValue.slice(1, parametrValue.length);
    let symbol = parametrValue.slice(0, 1);
    let num = Number(parametrValue.slice(1, parametrValue.length));
    switch (parametr) {        
		case 'city':            
			arrResult = arrResult.filter((item) => item.city === value);
			break;
		case 'region':            
			arrResult = arrResult.filter((item) => item.region === value);
			break;
		case 'number':            
			switch (symbol) {
				case '<':
					arrResult = arrResult.filter((item) => item.number < num);
					break;
				case '>':
					arrResult = arrResult.filter((item) => item.number > num);
					break;
				case '=':
					arrResult = arrResult.filter((item) => item.number === num);
					break;
			}
			break;
	}      
    callback(arrResult, arrLimit, writeFile);
}
function NumberOfCitiesForReturn(arr, arrLimit, callback) {
    let arrResult = {};
    if (arrLimit[0] === 'all') {
        arrResult = arr;
    }
    else if (arrLimit[0] === 'first') {
        arrResult = arr[0];
    }
    else if (arrLimit[0] === 'second') {
        arrResult = arr[1];
    }
    else if (arrLimit[0] === 'last') {
        arrResult = arr[arr.length - 1];
    }
    callback(arrResult);
    console.log(arrResult);
}
function writeFile(data) {
    return new Promise ( (res, rej) => {
        fs.writeFile(RESULT, JSON.stringify(data), 'utf8', (err) => {
			if(err) {rej(error);}
			else {res(data);}
    });
});
}