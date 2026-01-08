import pygame
import random

# --- GAME SETUP ---
def word():
    with open("english.txt", "r", encoding="utf-8") as f:
        lines = [line.strip() for line in f if line.strip()]
    return random.choice(lines).lower()

def under(x):
    return "_" * len(x)

# --- PYGAME SETUP ---
pygame.init()
screen = pygame.display.set_mode((600, 600))
pygame.display.set_caption("Hangman")

font = pygame.font.Font(None, 48)
small_font = pygame.font.Font(None, 32)

background_color = (240, 240, 240)
black = (0, 0, 0)

clock = pygame.time.Clock()

# --- GAME VARIABLES ---
def init_game():
    global x, c, guessed, p, game_over, result_text
    x = word()
    guessed = set()
    p = 0
    game_over = False
    result_text = ""
    c = "".join([ch if ch in guessed else "_" for ch in x])

init_game()
max_penalty = 12

# --- STICKMAN DRAWING ---
def draw_gallows(surface):
    pygame.draw.line(surface, black, (150, 500), (450, 500), 4)  # base
    pygame.draw.line(surface, black, (300, 500), (300, 150), 4)  # pole
    pygame.draw.line(surface, black, (300, 150), (400, 150), 4)  # top beam
    pygame.draw.line(surface, black, (400, 150), (400, 180), 4)  # rope

def draw_stickman(surface, p):
    # Positions
    head_center = (400, 210)
    body_top = (400, 230)
    body_bottom = (400, 310)
    
    # Draw parts progressively based on penalty count
    if p >= 1:  # head
        pygame.draw.circle(surface, black, head_center, 20, 2)
    if p >= 2:  # body
        pygame.draw.line(surface, black, body_top, body_bottom, 2)
    if p >= 3:  # left arm
        pygame.draw.line(surface, black, (body_top[0], body_top[1]+10), (body_top[0]-40, body_top[1]+60), 2)
    if p >= 4:  # right arm
        pygame.draw.line(surface, black, (body_top[0], body_top[1]+10), (body_top[0]+40, body_top[1]+60), 2)
    if p >= 5:  # left leg
        pygame.draw.line(surface, black, body_bottom, (body_bottom[0]-30, body_bottom[1]+60), 2)
    if p >= 6:  # right leg
        pygame.draw.line(surface, black, body_bottom, (body_bottom[0]+30, body_bottom[1]+60), 2)
    if p >= 7:  # left eye
        pygame.draw.circle(surface, black, (head_center[0]-7, head_center[1]-5), 3)
    if p >= 8:  # right eye
        pygame.draw.circle(surface, black, (head_center[0]+7, head_center[1]-5), 3)
    if p >= 9:  # mouth
        pygame.draw.arc(surface, black, (head_center[0]-8, head_center[1]+2, 16, 8), 3.14, 0, 2)
    if p >= 10:  # optional small extra arm movement
        pygame.draw.line(surface, black, (body_top[0], body_top[1]+20), (body_top[0]-20, body_top[1]+50), 2)
    if p >= 11:  # optional small extra arm movement
        pygame.draw.line(surface, black, (body_top[0], body_top[1]+20), (body_top[0]+20, body_top[1]+50), 2)
    if p >= 12:  # optional extra detail
        pygame.draw.line(surface, black, (body_bottom[0]-15, body_bottom[1]+30), (body_bottom[0]+15, body_bottom[1]+30), 2)

# --- MAIN LOOP ---
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

        if not game_over and event.type == pygame.KEYDOWN:
            letter = event.unicode.lower()
            if letter.isalpha() and letter not in guessed:
                guessed.add(letter)
                if letter not in x:
                    p += 1
                c = "".join([ch if ch in guessed else "_" for ch in x])

                # Check game status
                if c == x:
                    game_over = True
                    result_text = "You Won! Press Enter to play again."
                elif p >= max_penalty:
                    game_over = True
                    result_text = f"You Lost! Word was '{x}'. Press Enter to play again."

        # Restart game on Enter key
        if game_over and event.type == pygame.KEYDOWN and event.key == pygame.K_RETURN:
            init_game()

    # --- DRAW ---
    screen.fill(background_color)
    draw_gallows(screen)
    draw_stickman(screen, p)

    word_surface = font.render(" ".join(c), True, black)
    screen.blit(word_surface, (50, 80))

    guessed_surface = small_font.render("Guessed: " + " ".join(sorted(guessed)), True, black)
    screen.blit(guessed_surface, (50, 160))

    tries_surface = small_font.render(f"Tries left: {max_penalty - p}", True, black)
    screen.blit(tries_surface, (50, 200))

    if game_over:
        result_surface = small_font.render(result_text, True, black)
        screen.blit(result_surface, (50, 260))

    pygame.display.flip()
    clock.tick(30)

pygame.quit()
    