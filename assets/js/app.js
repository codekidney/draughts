class Calc {
    static between = (a, b) => {
        return ( Number(a) + Number(b) )/2;
    }
}
class Board {
    constructor(boardElem, cols, pawnNbr) {
        this.boardElem = boardElem;
        this.fieldNbr = Math.pow(cols,2);
        this.cols = cols;
        this.fields = [];
        this.pawns = [];
        this.pawnsNbr = pawnNbr;
        this.pawnMoveElem;
        this.nextColor = 'white';
        this.score = {
            white: 0,
            black: 0,
        };

        this.fieldSize = this.pawnSize = 100/this.cols;
        this.fieldSize = 100/this.cols;
        this.addStyle('.field {width:'+this.fieldSize+'%;height:'+this.fieldSize+'%;}');
    }

    updateScore = (value, color) => {

        // update score
        if(value > 0){
            this.score[color] += value;
        }

        // update html element
        if(color === 'white') {
            document.getElementById('score_white').innerText = this.score.white;
        } else {
            document.getElementById('score_black').innerText = this.score.black;
        }

        // set next user to move
        this.nextColor = (color === 'white') ? 'black' : 'white';

        // print message
        if(this.score.white === this.pawnsNbr || this.score.black === this.pawnsNbr){
            const winner = (this.score.white > this.score.black) ? 'WHITE' : 'BLACK';
            document.getElementById('score_message').innerText = `WINNER IS player ${winner}`;
        } else if (this.score.white < this.pawnsNbr || this.score.black < this.pawnsNbr) {
            document.getElementById('score_message').innerText = `Your move player: ${this.nextColor}`;
        } else {
            document.getElementById('score_message').innerText = `Unknown error`;
        }
    }

    addPawnsMove = () => {
        const scope = this;
        for(let field of this.fields){
            const fieldElem = field.elem;
            if(field.class === 'even'){
                fieldElem.addEventListener('dragover', function(e){
                    e.preventDefault();
                    // console.log(`dragover`);
                });
                fieldElem.addEventListener('dragenter', function(e){
                    e.preventDefault();
                    // console.log(`dragenter`);
                });
                fieldElem.addEventListener('dragleave', function(){
                    // console.log(`dragleave`);
                });
                fieldElem.addEventListener('drop', function(){
                    
                    const pawnElem  = board.pawnMoveElem;
                    const fieldElem = this; 
                    
                    if (pawnElem.dataset.color !== scope.nextColor) {
                        alert('Whait for your move');
                        return;
                    }
                    
                    if(!this.hasChildNodes()){
                        const single_diagonal_movement = ( 
                            Math.abs(Number(fieldElem.dataset.col) - Number(pawnElem.dataset.col)) === 1 &&
                            Math.abs(Number(fieldElem.dataset.row) - Number(pawnElem.dataset.row)) === 1
                        ) ? true : false;
                        if(single_diagonal_movement){
                            // update score
                            scope.updateScore(0,pawnElem.dataset.color);
                        }

                        const double_diagonal_movement = ( 
                            Math.abs(Number(fieldElem.dataset.col) - Number(pawnElem.dataset.col)) === 2 &&
                            Math.abs(Number(fieldElem.dataset.row) - Number(pawnElem.dataset.row)) === 2
                        ) ? true : false;
                        if(double_diagonal_movement){
                            //find element between fields start/end
                            const between = { 
                                col: Calc.between(fieldElem.dataset.col, pawnElem.dataset.col), 
                                row: Calc.between(fieldElem.dataset.row, pawnElem.dataset.row),
                            };
                            const betweenFieldElem = document.querySelector('.field[data-col="'+between.col+'"][data-row="'+between.row+'"]');
                            if(betweenFieldElem.hasChildNodes()){
                                const betweenPawnElem = betweenFieldElem.firstChild;
                                const is_score = pawnElem.dataset.color !== betweenPawnElem.dataset.color;
                                if(is_score){
                                    
                                    // remove opponents pawn element
                                    betweenFieldElem.removeChild( betweenPawnElem );
                                    
                                    // update score
                                    scope.updateScore(1,pawnElem.dataset.color);
                                }
                            }
                            
                        }

                        if(single_diagonal_movement || double_diagonal_movement){
                            pawnElem.dataset.col = fieldElem.dataset.col;
                            pawnElem.dataset.row = fieldElem.dataset.row;
                            fieldElem.append( pawnElem );
                        }
                    }
                });

            }

        }

        for(let pawnElem of this.pawns){
            pawnElem.setAttribute('draggable', true);

            pawnElem.addEventListener('dragstart', function(){
                // console.log('dragstart');
                board.pawnMoveElem = this;
            });
            pawnElem.addEventListener('dragend', function(){
                // console.log('dragend');
            });
        }
    }

    addPawns = () => {
        const pawnsNbr = this.pawnsNbr;

        // place 12 pawn on odd fields
        let pawn_i = 0;
        for(let field of this.fields){
            if(field.class === 'even'){
                if(pawn_i < pawnsNbr){
                    const pawnElem = document.createElement('div');
                    pawnElem.classList.add('pawn');
                    pawnElem.classList.add('even');
                    pawnElem.dataset.color = 'white';
                    pawnElem.dataset.col = field.col;
                    pawnElem.dataset.row = field.row;
                    field.elem.appendChild(pawnElem);
                    this.pawns.push(pawnElem);
                    pawn_i++;
                } else {
                    break;
                }
            }
        }
        
        pawn_i = 0;
        for (let i = this.fields.length - 1; i >=0 ; i--) {
            const field = this.fields[i];
            if(field.class === 'even'){
                if(pawn_i < pawnsNbr){
                    const pawnElem = document.createElement('div');
                    pawnElem.classList.add('pawn');
                    pawnElem.classList.add('odd');
                    pawnElem.dataset.color = 'black';
                    pawnElem.dataset.col = field.col;
                    pawnElem.dataset.row = field.row;
                    field.elem.appendChild(pawnElem);
                    this.pawns.push(pawnElem);
                    pawn_i++;
                } else {
                    return;
                }
            }
        }
    }

    addFields = () =>  {
        let i = 0;
        let row_i = 0;
        let col_i = 0;
        while(i<this.fieldNbr){
            const field = document.createElement('div');
            field.classList.add('field');
            let fieldClass = '';
            if(row_i%2 === 0 && this.cols%2 === 0){
                fieldClass = (i%2 === 0) ? 'odd' : 'even';
            } else {
                fieldClass = (i%2 === 0) ? 'even' : 'odd';
            }
            field.classList.add( fieldClass );
            field.dataset.col  = col_i;
            field.dataset.row  = row_i;

            this.boardElem.appendChild(field);
            this.fields.push({id: i, row:row_i, col:col_i, class: fieldClass, elem: field});

            i++;
            col_i++;
            if(i%this.cols === 0){
                col_i = 0;
                row_i++;
            }
        }
    }
    addStyle = (styles) => {
        var css = document.createElement('style');
        css.type = 'text/css';
      
        if (css.styleSheet) css.styleSheet.cssText = styles;
        else css.appendChild(document.createTextNode(styles));
      
        document.getElementsByTagName("head")[0].appendChild(css);       
    }
}

const draughts = () => {
    const boardElem = document.getElementById('board');
    const board = new Board( boardElem, 8, 12);
    board.addFields();
    board.addPawns();
    board.addPawnsMove();
}
window.addEventListener('load', draughts);

function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;