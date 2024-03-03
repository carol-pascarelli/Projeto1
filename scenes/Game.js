// Definindo a cena principal do jogo usando a biblioteca Phaser
class Game extends Phaser.Scene {
    // Construtor da cena
    constructor() {
        super({
            key: 'Game',
            // Configurações específicas da cena
             physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 400 },
                    debug: false
                }
            }
            
        });
    }

    
//carrega as imagens no código
preload () {
    this.load.image('sky', 'assets/bg_sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('ground1', 'assets/platform1.png');
    this.load.image('grass', 'assets/Grama.png');
    this.load.image('novelo', 'assets/novelo.png');
    this.load.image('drop', 'assets/drop.png');
    this.load.spritesheet('cat', 'assets/dude.png', 
   // altura e largura da spritesheet em pixels
    {frameWidth: 128, frameHeight: 96}) ;
}

// adiciona e mostra as imagens carregadas na tela
create () {
    // cria a função dos cursores
   this.cursors = this.input.keyboard.createCursorKeys();
    // adiciona e dimensiona o céu
   this.add.image(400, 300, 'sky').setScale(2);
    // adiciona plataformas como imagem estática
   this.platforms = this.physics.add.staticGroup();
    // coloca as dimensões e escala da plataforma 
    this.platforms.create(600, 710, 'grass').setScale(2).refreshBody(); 
    // adiciona em lugares específicos as plataformas
    this.platforms.create(1000, 200 ,'ground1');
    this.platforms.create(50, 350,'ground');
    this.platforms.create(1200, 500 ,'ground');

    this.player = this.physics.add.sprite(100, 450, 'cat').setScale(1);

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    
    this.anims.create( 
        {
            key: 'walk',
            // onde começa e onde termina o sprite para se movimentar
            frames: this.anims.generateFrameNumbers('cat', {start: 0, end: 5 }),
             // velocidade da passagem dos frames por segundo
            frameRate: 12,
            repeat: -1 // repete infinitamente
        }
     );

// plataforma e boneco colidem
this.physics.add.collider(this.player, this.platforms);
// grama e boneco colidem
this.physics.add.collider(this.player, this.grass);


//adiciona diversos novelos para serem coletados
this.novelo = this.physics.add.group(
    {
        key: 'novelo',
        repeat: 8, // cria 12 crianças 
        setXY: { x: 9, y: 0, stepX: 120 } // coloca a posição dos novelos criados 
    }
);

// tamanho e pulo dos novelos
this.novelo.children.iterate(nov => {
    nov.setScale(0.1)
    nov.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
}
);


 // adiciona collider entre novelos e plataformas
this.physics.add.collider(this.novelo, this.platforms);
 // adiciona collider entre novelos e grama
 this.physics.add.collider(this.novelo, this.grass);

// identifica overlap das novelos e jogador 
this.physics.add.overlap(this.player, this.novelo, this.collectNovelo, null, this);

this.score = 0;

// adiciona texto do placar
this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000'});

// adiciona gotas d´água
this.drops = this.physics.add.group();
// adiciona colisão entre gotas e plataforma
this.physics.add.collider(this.drops, this.platforms);
// colisão entre jogador e gotas
this.physics.add.collider(this.player, this.drops, this.hitDrop, null, this);

}

// função coletar novelos
collectNovelo (player, novelo)
{
    //tira novelos coletados
    novelo.disableBody(true, true);

    // adiciona 1 pontos no placar
    this.score += 1;

    // adiciona placar na tela
    this.scoreText.setText('Score:' + this.score);

    //
    if (this.novelo.countActive(true) === 0)
    {
        this.novelo.children.iterate(nov =>  {
            nov.enableBody(true, nov.x, 0, true, true);
        });
// onde vai cair
        const x = (player.x < 400) ? Phaser.Math.Between(400, 800) :
Phaser.Math.Between(0, 400);
// adiciona configurações da gota
        const drop = this.drops.create(x, 16, 'drop');
        drop.setScale(0.03);
        drop.setBounce(1);
        drop.setCollideWorldBounds(true);
        drop.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}

// função quando o jogador tocar na gota
hitDrop(player, drop)
{
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    this.gameOver = true
}


update ()
{
    //adiciona a função de cada cursor e o sprite do personagem para cada ação
    if (this.cursors.left.isDown)
        this.player.setVelocityX(-300),
        this.player.setFlipX(true, false),
        this.player.anims.play('walk', true);
    else if (this.cursors.right.isDown)
        this.player.setVelocityX(300),
        this.player.anims.play('walk', true),
        this.player.setFlipX(false, false);// muda a direção do gato dependendo do lado que ele esta indo
    else
        this.player.setVelocityX(0),
       this.player.anims.play('walk');
    if (this.cursors.space.isDown && this.player.body.touching.down)
        this.player.setVelocityY(-500);
    
}
};

