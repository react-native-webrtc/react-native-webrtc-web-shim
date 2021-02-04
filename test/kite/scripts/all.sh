DIR=$(dirname "$(realpath $0)")
$DIR/build.sh
$DIR/run.sh && $DIR/dashboard.sh
