param (
    [string]$action,
    [string]$arg
)

[Console]::InputEncoding  = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$composeFile = "docker/dev/docker-compose.yml"
$envFile     = "docker/dev/.env"

function DC {
    param (
        [Parameter(ValueFromRemainingArguments = $true)]
        [string[]]$Args
    )

    docker compose `
        --file $composeFile `
        --env-file $envFile `
        @Args
}

function Fail($msg) {
    Write-Host "-> $msg" -ForegroundColor Red
    exit 1
}

switch ($action) {
    "up" {
        DC up --detach
    }

    "up:build" {
        DC up --detach --build
    }

    "up:clean" {
        DC build --no-cache
        DC up --detach
    }

    "up:reset" {
        DC down --volumes
        DC up --detach --build
    }

    "down" {
        DC down
    }

    "down:volumes" {
        DC down --volumes
    }

    "start" {
        if (-not $arg) { Fail "Service requis" }
        DC up --detach $arg
    }

    "stop" {
        if (-not $arg) { Fail "Service requis" }
        DC stop $arg
    }

    "restart" {
        if (-not $arg) { Fail "Service requis" }
        DC restart $arg
    }

    "rebuild" {
        if (-not $arg) { Fail "Service requis" }
        DC build --no-cache $arg
        DC up --detach $arg
    }

    "logs" {
        if ($arg) {
            DC logs --follow $arg
        } else {
            DC logs --follow
        }
    }

    "vol:rm" {
        if (-not $arg) { Fail "Nom du volume requis" }
        docker volume rm $arg
    }

    "vol:prune" {
        DC down --volumes
    }

    default {
        Write-Host ""
        Write-Host "Usage :" -ForegroundColor Cyan
        Write-Host "  up                 Démarre la stack en arrière-plan (cache actif)"
        Write-Host "  up:build           Démarre la stack avec rebuild des images"
        Write-Host "  up:clean           Rebuild complet des images (sans cache) puis démarrage"
        Write-Host "  up:reset           Destruction containers + volumes puis démarrage propre"
        Write-Host "  down               Arrêt des containers et du réseau"
        Write-Host "  down:volumes       Arrêt de la stack et suppression des volumes"
        Write-Host "  start <service>    Démarrage ciblé d’un service"
        Write-Host "  stop <service>     Arrêt ciblé d’un service"
        Write-Host "  restart <service>  Redémarrage d’un service sans rebuild"
        Write-Host "  rebuild <service>  Rebuild complet d’un service puis redémarrage"
        Write-Host "  logs [service]     Streaming des logs (stack ou service)"
        Write-Host "  vol:rm <volume>    Suppression explicite d’un volume"
        Write-Host "  vol:prune          Suppression des volumes du projet"
        Write-Host ""
    }
}
