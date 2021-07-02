#!/bin/sh
function scanForUglify(){
    local curDir parentDir workdir 
    workdir=$1
    cd ${workdir}
    if [ ${workdir} = "/" ]
    then
        curDir=""
    else
        curDir=$(pwd)
    fi
    for file in $(ls ${curDir})
    do
        # echo ${file}
        if test -d ${file}
        then
            cd ${file}
            scanForUglify ${curDir}/${file} $2
            cd ..
        else
            if [[ ${file:(-${#2})} = $2 ]]
            then
                # echo ${file}
                uglifyjs $file --compress --mangle -o $(echo $file|sed 's/\.js/\.js/') 
            fi
        fi
    done
}

if test -d $1
then
    scanForUglify $1 $2
elif test -f $1
then
    echo "错误：第一个参数不是目录"
    exit 1
else
    echo "错误：第一个参数指向的目录不存在"
    exit 1
fi