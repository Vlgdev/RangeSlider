<h1>Range slider plugin</h1>
<a href="https://vlgdev.github.io/RangeSlider/">Демо</a>

<h2>Установка пакетов</h2>
<pre>npm i</pre>

<h2>Запуск dev сервера</h2>
<pre>npm run start</pre>

<h2>Тестирование</h2>
<pre>npm run test</pre>

<h2>Использование</h2>
<pre>
    $('.slider').rangeFSD({...options})
    $('#range').rangeFSD()
</pre>

<h2>Опции</h2>

<table>
    <thead>
    <tr>
        <th>Название</th>
        <th>Тип</th>
        <th>По умолчанию</th>
        <th>Описание</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>step</td>
        <td>integer, float</td>
        <td>1</td>
        <td>Определяет размер шага</td>
    </tr>
    <tr>
        <td>min</td>
        <td>integer, float</td>
        <td>1</td>
        <td>Определяет минимальное значение</td>
    </tr>
    <tr>
        <td>max</td>
        <td>integer, float</td>
        <td>10</td>
        <td>Определяет максимальное значение</td>
    </tr>
    <tr>
        <td>progressBar</td>
        <td>boolean</td>
        <td>true</td>
        <td>Отвечает за отображение шкалы прогресса от минимального до текущего значения при одиночном значении и от начального до конечного значения при интервальном значении</td>
    </tr>
    <tr>
        <td>interval</td>
        <td>boolean</td>
        <td>false</td>
        <td>Включает/отключает интервальное значение</td>
    </tr>
    <tr>
        <td>currentValue</td>
        <td>integer, float</td>
        <td>Равно минимальному значению</td>
        <td>Устанавливает текущее значение при одиночном значении</td>
    </tr>
    <tr>
        <td>startValue</td>
        <td>integer, float</td>
        <td>Равно минимальному значению</td>
        <td>Устанавливает начальное значение при интервальном значении</td>
    </tr>
    <tr>
        <td>endValue</td>
        <td>integer, float</td>
        <td>Равно максимальному значению</td>
        <td>Устанавливает конечное значение при интервальном значении</td>
    </tr>
    <tr>
        <td>scaleOfValues</td>
        <td>boolean</td>
        <td>false</td>
        <td>Отвечает за отображение на шкале значений дополнительных возможных значений</td>
    </tr>
    <tr>
        <td>vertical</td>
        <td>boolean</td>
        <td>false</td>
        <td>Отвечает за отображение слайдера в вертикальном положении</td>
    </tr>
    <tr>
        <td>prompt</td>
        <td>boolean</td>
        <td>true</td>
        <td>Отвечает за отображение элемента-подсказки над ползунком, который показывает текущее значение ползунка</td>
    </tr>
    <tr>
        <td>init</td>
        <td>function</td>
        <td>n/a</td>
        <td>Функция, которая срабатывает после инициализации слайдера. Параметры: target</td>
    </tr>
    <tr>
        <td>onMove</td>
        <td>function</td>
        <td>n/a</td>
        <td>Функция, которая срабатывает при движении слайдера. Параметры: slider, target</td>
    </tr>
    </tbody>
</table>

<p>Пример:</p>
<pre>
    $('.slider').rangeFSD({
        min: 500,
        max: 10000,
        step: 500,
        interval: true
    })
</pre>
<p>После подключения слайдера к элементу, параметры слайдера записываются в объект элемента. Поэтому вы можете получить доступ к элементу, например через querySelector(), и изменить параметры динамически. Для изменения доступны только свойства объекта параметров</p>
<p>Пример:</p>
<pre>
    console.log(slider.progressBar);
    slider.interval = true;
</pre>
