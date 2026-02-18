{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const books = [\
    \{\
        title: "\uc0\u1607 \u1606 \u1585  \u1588 \u1601 \u1575 \u1601  \u1575 \u1606 \u1583 \u1740 \u1588 \u1740 \u1583 \u1606 ",\
        author: "\uc0\u1585 \u1608 \u1604 \u1601  \u1583 \u1608 \u1576 \u1604 \u1740 ",\
        cover: "\uc0\u55358 \u56800 ",\
        link: "#"\
    \},\
    \{\
        title: "\uc0\u1575 \u1606 \u1587 \u1575 \u1606  \u1583 \u1585  \u1580 \u1587 \u1578 \u1580 \u1608 \u1740  \u1605 \u1593 \u1606 \u1575 ",\
        author: "\uc0\u1608 \u1740 \u1705 \u1578 \u1608 \u1585  \u1601 \u1585 \u1575 \u1606 \u1705 \u1604 ",\
        cover: "\uc0\u55356 \u57092 ",\
        link: "#"\
    \},\
    \{\
        title: "\uc0\u1705 \u1740 \u1605 \u1740 \u1575 \u1711 \u1585 ",\
        author: "\uc0\u1662 \u1575 \u1574 \u1608 \u1604 \u1608  \u1705 \u1608 \u1574 \u1604 \u1740 \u1608 ",\
        cover: "\uc0\u55356 \u57119 ",\
        link: "#"\
    \},\
    \{\
        title: "\uc0\u1670 \u1607 \u1575 \u1585  \u1605 \u1740 \u1579 \u1575 \u1602 ",\
        author: "\uc0\u1583 \u1608 \u1606  \u1605 \u1740 \u1711 \u1604  \u1585 \u1608 \u1574 \u1740 \u1586 ",\
        cover: "\uc0\u55357 \u56540 ",\
        link: "#"\
    \},\
    \{\
        title: "\uc0\u1602 \u1583 \u1585 \u1578  \u1593 \u1575 \u1583 \u1578 ",\
        author: "\uc0\u1670 \u1575 \u1585 \u1604 \u1586  \u1583 \u1608 \u1607 \u1740 \u1711 ",\
        cover: "\uc0\u55357 \u56580 ",\
        link: "#"\
    \},\
    \{\
        title: "\uc0\u1576 \u1740 \u1583 \u1575 \u1585 \u1740 ",\
        author: "\uc0\u1570 \u1606 \u1578 \u1608 \u1606 \u1740  \u1583 \u1608  \u1605 \u1604 \u1608 ",\
        cover: "\uc0\u9728 \u65039 ",\
        link: "#"\
    \}\
];\
\
const container = document.getElementById('books-container');\
\
books.forEach(book => \{\
    const card = document.createElement('div');\
    card.className = 'book-card';\
    \
    card.innerHTML = `\
        <div class="book-cover">$\{book.cover\}</div>\
        <div class="book-info">\
            <h3 class="book-title">$\{book.title\}</h3>\
            <p class="book-author">$\{book.author\}</p>\
            <a href="$\{book.link\}" class="book-link">\uc0\u1605 \u1591 \u1575 \u1604 \u1593 \u1607  \u8594 </a>\
        </div>\
    `;\
    \
    container.appendChild(card);\
\});}