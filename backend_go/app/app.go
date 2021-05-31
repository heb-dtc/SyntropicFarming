package app

import (
	"backend/app/database"
	"backend/app/middleware"
	"backend/app/router"
)

type App struct {
	Router  *router.AppRouter
	DB      database.SyntropicDb
	Handler *middleware.Handler
}

func New() *App {

	db := &database.DB{}

	app := &App{
		Router:  router.New(),
		DB:      db,
		Handler: middleware.New(db),
	}

	// setup routes
	app.Router.RegisterApiRoutes(app.Handler)
	app.Router.RegisterDashboardRoutes(app.Handler)

	return app
}
